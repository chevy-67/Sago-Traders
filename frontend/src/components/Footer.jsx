import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col">
                    <h4>ONLINE BOOKING</h4>
                    <ul>
                        <li>Hardware</li>
                        <li>Electricals</li>
                        <li>Paints</li>
                        <li>Appliances</li>
                        <li>Lightings & Fans</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>QUICK LINKS</h4>
                    <ul>
                        <li>About Us</li>
                        <li>Terms & Conditions</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>CONNECT WITH US</h4>
                    <div className="social-icons">
                        <Facebook className="social-icon" />
                        <Instagram className="social-icon" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
