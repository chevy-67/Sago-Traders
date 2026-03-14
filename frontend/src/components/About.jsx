import React from 'react';
import '../styles/About.css';

/* ─── DATA ─────────────────────────────────────────────── */

const STATS = [
    { number: '15+', label: 'Years of Excellence' },
    { number: '5,000+', label: 'Products in Stock' },
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Trusted Brands' },
];

const VALUES = [
    {
        icon: '🏆',
        title: 'Quality First',
        body: 'We stock only premium-grade materials tested for durability and compliance. Every product earns its place on our shelves.',
    },
    {
        icon: '🤝',
        title: 'Honest Guidance',
        body: 'No upselling, no jargon. Our team gives you frank, expert advice so you buy exactly what your project needs.',
    },
    {
        icon: '🚚',
        title: 'Reliable Supply',
        body: 'From a single bolt to an entire site delivery, we ensure materials arrive on time, every time.',
    },
    {
        icon: '🌱',
        title: 'Sustainable Sourcing',
        body: 'We partner with manufacturers who share our commitment to responsible production and greener construction.',
    },
    {
        icon: '💡',
        title: 'Innovation',
        body: 'We continuously expand our catalogue with modern materials and tools that help builders achieve more with less.',
    },
    {
        icon: '🏘️',
        title: 'Community Roots',
        body: 'Born in Bangalowpudur, Erode, we reinvest in the community that built us — sponsoring local trade training programmes.',
    },
];

const TEAM = [
    {
        initials: 'Er',
        name: 'T.Gokulnath',
        role: 'Founder & Managing Director',
    },
    {
        initials: 'PM',
        name: 'P. Muthuswamy',
        role: 'Head of Procurement',
    },
    {
        initials: 'AK',
        name: 'A. Kavitha',
        role: 'Customer Relations Manager',
    },
];

const STORY_POINTS = [
    'Founded in 2009 with a single showroom in Bangalowpudur, Erode.',
    'Expanded to over 5,000 SKUs spanning structural, finishing, and electrical categories.',
    'Trusted partner for residential builders, contractors, and infrastructure projects across Tamil Nadu.',
    'Dedicated delivery fleet ensuring on-site delivery throughout the Erode district.',
];

/* ─── COMPONENT ─────────────────────────────────────────── */

const About = () => {
    return (
        <div className="about-page">

            {/* ───── HERO ───── */}
            <section className="about-hero">
                <div className="about-hero__bg-overlay" />
                <div className="about-hero__pattern" />
                <div className="about-hero__content">
                    <span className="about-hero__badge">
                        <span className="about-hero__badge-dot" />
                        Established 2009 · Bangalowpudur, Erode
                    </span>
                    <h1 className="about-hero__title">
                        Building Tamil Nadu's&nbsp;Future,<br />
                        <span>One Material at a Time.</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        Sago Traders is your trusted specialist for hardware and construction
                        materials — combining an industry-wide product range with the
                        personalised service of a neighbourhood partner.
                    </p>
                    <div className="about-hero__divider" />
                </div>
            </section>

            {/* ───── STATS STRIP ───── */}
            <div className="about-stats-strip">
                <div className="about-stats-strip__inner">
                    {STATS.map((s) => (
                        <div className="about-stat" key={s.label}>
                            <div className="about-stat__number">{s.number}</div>
                            <div className="about-stat__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ───── OUR STORY ───── */}
            <div style={{ background: 'var(--about-white)' }}>
                <div className="about-section">
                    <div className="about-two-col">
                        {/* Image side */}
                        <div className="about-two-col__img-wrap">
                            <img
                                src="/assets/images/Human/elite-team.jpg"
                                alt="Sago Traders showroom"
                                className="about-two-col__img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.background =
                                        'linear-gradient(135deg, #3E2723 0%, #DC7835 100%)';
                                }}
                            />
                            <div className="about-two-col__corner-badge">
                                <strong>15+</strong>
                                Years Serving<br />Tamil Nadu
                            </div>
                        </div>

                        {/* Text side */}
                        <div className="about-two-col__text">
                            <span className="about-section__label">Our Story</span>
                            <h2 className="about-section__title">
                                From a Single Showroom&nbsp;to&nbsp;a&nbsp;Regional&nbsp;Leader
                            </h2>
                            <div className="about-section__divider" />
                            <p className="about-section__description">
                                What began as a modest hardware shop has grown into one of Erode district's
                                most comprehensive construction material suppliers. Our journey is built on
                                a simple promise: provide the best products at fair prices, backed by
                                expert advice you can trust.
                            </p>
                            <ul className="about-two-col__list">
                                {STORY_POINTS.map((point) => (
                                    <li className="about-two-col__list-item" key={point}>
                                        <span className="about-two-col__list-icon">✓</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ───── MISSION & VISION ───── */}
            <div className="about-section--grey">
                <div className="about-section">
                    <span className="about-section__label">What Drives Us</span>
                    <h2 className="about-section__title">Mission &amp; Vision</h2>
                    <div className="about-section__divider" />
                    <div className="about-mv-grid">
                        {/* Mission */}
                        <div className="about-mv-card about-mv-card--mission">
                            <div className="about-mv-card__icon">🎯</div>
                            <h3 className="about-mv-card__title">Our Mission</h3>
                            <p className="about-mv-card__body">
                                To empower every builder — from the weekend DIY enthusiast to the
                                large-scale infrastructure contractor — with premium construction
                                materials, transparent pricing, and the expert counsel needed to
                                bring projects to life safely and efficiently.
                            </p>
                            <div className="about-mv-card__watermark">M</div>
                        </div>
                        {/* Vision */}
                        <div className="about-mv-card about-mv-card--vision">
                            <div className="about-mv-card__icon">🔭</div>
                            <h3 className="about-mv-card__title">Our Vision</h3>
                            <p className="about-mv-card__body">
                                To be Tamil Nadu's most trusted construction materials partner — a
                                business where quality, sustainability, and community development
                                are not aspirations but everyday practice, enabling a generation of
                                builders to construct a stronger, greener India.
                            </p>
                            <div className="about-mv-card__watermark">V</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ───── CORE VALUES ───── */}
            <div style={{ background: 'var(--about-white)' }}>
                <div className="about-section">
                    <span className="about-section__label">Why Choose Us</span>
                    <h2 className="about-section__title">Our Core Values</h2>
                    <div className="about-section__divider" />
                    <div className="about-values-grid">
                        {VALUES.map((v) => (
                            <div className="about-value-card" key={v.title}>
                                <div className="about-value-card__icon">{v.icon}</div>
                                <h3 className="about-value-card__title">{v.title}</h3>
                                <p className="about-value-card__body">{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ───── TEAM ───── */}
            <div className="about-section--cream">
                <div className="about-section">
                    <span className="about-section__label">The People Behind It</span>
                    <h2 className="about-section__title">Meet Our Leadership</h2>
                    <div className="about-section__divider" />
                    <div className="about-team-grid">
                        {TEAM.map((member) => (
                            <div className="about-team-card" key={member.name}>
                                <div className="about-team-card__img-wrap">
                                    <div className="about-team-card__avatar-placeholder">
                                        {member.initials}
                                    </div>
                                    <div className="about-team-card__img-stripe" />
                                </div>
                                <div className="about-team-card__body">
                                    <h3 className="about-team-card__name">{member.name}</h3>
                                    <p className="about-team-card__role">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ───── CONTACT BAND ───── */}
            <div className="about-contact-band">
                <div className="about-contact-band__inner">
                    <h2 className="about-contact-band__title">Get in Touch</h2>
                    <p className="about-contact-band__sub">
                        Whether you need bulk quotations, product guidance, or just want to visit our
                        showroom — we're here to help.
                    </p>
                    <div className="about-contact-cards">
                        <div className="about-contact-card">
                            <span className="about-contact-card__icon">📞</span>
                            <span className="about-contact-card__label">Phone</span>
                            <span className="about-contact-card__value">+91 98765 43210</span>
                        </div>
                        <div className="about-contact-card">
                            <span className="about-contact-card__icon">✉️</span>
                            <span className="about-contact-card__label">Email</span>
                            <span className="about-contact-card__value">contact@sagotraders.com</span>
                        </div>
                        <div className="about-contact-card">
                            <span className="about-contact-card__icon">📍</span>
                            <span className="about-contact-card__label">Location</span>
                            <span className="about-contact-card__value">Bangalowpudur, Erode, Tamil Nadu</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
