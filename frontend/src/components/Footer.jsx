import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col">
                    <h4>ONLINE BOOKING</h4>
                    <ul>
                        <li>Hardware</li>
                        <li><Link to="/category/electricals">Electricals</Link></li>
                        <li><Link to="/category/tools">Hand Tools</Link></li>
                        <li><Link to="/category/paints">Paints</Link></li>
                        <li><Link to="/category/appliances">Appliances</Link></li>
                        <li><Link to="/category/lighting">Lightings & Fans</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>QUICK LINKS</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>CONNECT WITH US</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/p/Sago-kattumanam-traders-100064317240132/" target="_blank" rel="noopener noreferrer">
                            <Facebook className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/sago__traders" target="_blank" rel="noopener noreferrer">
                            <Instagram className="social-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
