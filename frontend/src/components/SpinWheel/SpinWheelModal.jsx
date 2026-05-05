import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './SpinWheelModal.css';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Draw the wheel on canvas ─────────────────────────────────── */
function drawWheel(canvas, segments, rotation) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const arc = (2 * Math.PI) / segments.length;

  ctx.clearRect(0, 0, size, size);

  segments.forEach((seg, i) => {
    const startAngle = rotation + i * arc;
    const endAngle   = startAngle + arc;

    // Slice
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size < 300 ? 11 : 13}px Inter, sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(seg.label, radius - 14, 5);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center emoji
  ctx.font = '18px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎡', cx, cy);
}

/* ─── Easing ────────────────────────────────────────────────────── */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

/* ─── Result helpers ────────────────────────────────────────────── */
function resultEmoji(type) {
  if (type === 'percent')       return '🎉';
  if (type === 'flat')          return '💰';
  if (type === 'free_shipping') return '🚚';
  if (type==='free_product') return '🎁';
  return '😊';
}
function resultSubtext(type, value) {
  if (type === 'percent')       return `${value}% discount on your next order`;
  if (type === 'flat')          return `₹${value} off on your next order`;
  if (type === 'free_shipping') return 'Free shipping on your next order';
  if (type==='free_product') return 'Free product on your next order';
  return 'Keep shopping — more offers await!';
}

/* ═══════════════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════════════ */
const CANVAS_SIZE = 300;
const SPIN_DURATION = 5000; // ms

export default function SpinWheelModal() {
  const { user } = useAuth();

  const [open, setOpen]           = useState(false);
  const [segments, setSegments]   = useState([]);
  const [spinning, setSpinning]   = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [prevResult, setPrevResult]   = useState(null);
  const [result, setResult]       = useState(null);   // won segment after spin
  const [showResult, setShowResult]   = useState(false);
  const [error, setError]         = useState('');

  const canvasRef    = useRef(null);
  const rotationRef  = useRef(0);        // current radian offset
  const rafRef       = useRef(null);

  const [isActive, setIsActive]   = useState(false);

  /* ── Fetch segments on mount ─────────────────────────────────── */
  useEffect(() => {
    fetch(`${API}/api/spin-wheel`)
      .then(r => r.json())
      .then(d => {
        setSegments(d.segments || []);
        setIsActive(d.isActive || false);
      })
      .catch(() => {});
  }, []);

  /* ── Check if logged-in user already spun ────────────────────── */
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    fetch(`${API}/api/spin-wheel/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.alreadySpun) {
          setAlreadySpun(true);
          setPrevResult(d.result);
        }
      })
      .catch(() => {});
  }, [user]);

  /* ── Redraw canvas whenever segments or rotation changes ─────── */
  useEffect(() => {
    if (canvasRef.current && segments.length > 0) {
      drawWheel(canvasRef.current, segments, rotationRef.current);
    }
  }, [segments, open]);

  /* ── Spin animation ──────────────────────────────────────────── */
  function animateSpin(targetRotation) {
    const startRotation = rotationRef.current;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = easeOut(progress);
      rotationRef.current = startRotation + eased * (targetRotation - startRotation);

      if (canvasRef.current && segments.length > 0) {
        drawWheel(canvasRef.current, segments, rotationRef.current);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rotationRef.current = targetRotation;
        setSpinning(false);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }

  /* ── Handle spin click ───────────────────────────────────────── */
  async function handleSpin() {
    if (spinning || segments.length === 0) return;
    setError('');
    setSpinning(true);

    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`${API}/api/spin-wheel/spin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.alreadySpun) {
          setAlreadySpun(true);
          setPrevResult(data.result);
        } else {
          setError(data.message || 'Something went wrong.');
        }
        setSpinning(false);
        return;
      }

      const wonIndex = data.result.index;
      const arc = (2 * Math.PI) / segments.length;

      // Target rotation: land on wonIndex segment (pointer is at top = -π/2)
      // Segment i center is at: i * arc + arc/2
      // We want that to be at -π/2 after full spins
      const randomOffset = (Math.random() - 0.5) * (arc * 0.8);
      const segCenter  = wonIndex * arc + arc / 2 + randomOffset;
      const target     = -Math.PI / 2 - segCenter;
      // Normalize and add several full rotations for drama
      const extraSpins = (Math.PI * 2) * Math.floor(5 + Math.random() * 3);
      const finalAngle = (target % (2 * Math.PI)) + extraSpins;

      // Animate
      animateSpin(rotationRef.current + finalAngle);

      // After animation ends show result
      setTimeout(() => {
        setResult(data.result);
        setShowResult(true);
        setAlreadySpun(true);
        setPrevResult(data.result);
      }, SPIN_DURATION + 300);

    } catch {
      setError('Network error. Please try again.');
      setSpinning(false);
    }
  }

  function handleClose() {
    if (spinning) return;
    cancelAnimationFrame(rafRef.current);
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
    // Redraw after mount
    setTimeout(() => {
      if (canvasRef.current && segments.length > 0) {
        drawWheel(canvasRef.current, segments, rotationRef.current);
      }
    }, 50);
  }

  /* ── Render ──────────────────────────────────────────────────── */
  if (!isActive) return null;

  return (
    <>
      {/* Floating trigger */}
      <button className="sw-trigger-btn" onClick={handleOpen} aria-label="Spin the wheel">
        <span>Spin &amp; Win!</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="sw-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
          <div className="sw-modal" role="dialog" aria-modal="true" aria-label="Spin the Wheel">
            <button className="sw-close-btn" onClick={handleClose} aria-label="Close">✕</button>

            <h2 className="sw-title">Spin &amp; Win!</h2>
            <p className="sw-subtitle">Win exciting offers on your next order!</p>

            {/* Wheel canvas */}
            {segments.length > 0 && (
              <div className="sw-canvas-wrapper">
                <div className="sw-pointer" />
                <canvas
                  ref={canvasRef}
                  className="sw-canvas"
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                />
              </div>
            )}

            {/* Content below wheel */}
            {!user ? (
              <div className="sw-login-prompt">
                <p>Please login to spin the wheel and win exciting offers!</p>
                <Link to="/login" className="sw-login-link" onClick={handleClose}>
                  Login to Spin
                </Link>
              </div>
            ) : alreadySpun && !showResult ? (
              <div className="sw-already-spun">
                <strong>{prevResult?.label || 'Your reward'}</strong>
                You've already used your spin.<br />
                {prevResult && resultSubtext(prevResult.type, prevResult.value)}
                {prevResult?.couponCode && (
                  <div style={{ marginTop: '12px', padding: '8px', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#aaa', display: 'block' }}>Your Coupon Code:</span>
                    <strong style={{ fontSize: '18px', color: '#fff', letterSpacing: '1px' }}>{prevResult.couponCode}</strong>
                  </div>
                )}
              </div>
            ) : (
              <>
                {error && <p className="sw-error">{error}</p>}
                {!alreadySpun && (
                  <button
                    className="sw-spin-btn"
                    onClick={handleSpin}
                    disabled={spinning}
                  >
                    {spinning ? 'Spinning…' : 'SPIN!'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Result card */}
      {showResult && result && (
        <div className="sw-result-overlay">
          <div className="sw-result-card">
            <div className="sw-result-emoji">{resultEmoji(result.type)}</div>
            <h3 className="sw-result-title">Congratulations!</h3>
            <p className="sw-result-label">{result.label}</p>
            <p className="sw-result-sub">{resultSubtext(result.type, result.value)}</p>
            {result?.couponCode && (
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', margin: '14px 0 24px', border: '1px dashed #E85D04' }}>
                <span style={{ fontSize: '13px', color: '#ccc', display: 'block', marginBottom: '4px' }}>Your Coupon Code:</span>
                <strong style={{ fontSize: '24px', color: '#fff', letterSpacing: '2px' }}>{result.couponCode}</strong>
                <span style={{ fontSize: '11px', color: '#F48C06', display: 'block', marginTop: '4px' }}>Valid for 14 days! Check your profile.</span>
              </div>
            )}
            <button className="sw-result-close" onClick={() => { setShowResult(false); handleClose(); }}>
              Awesome, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
