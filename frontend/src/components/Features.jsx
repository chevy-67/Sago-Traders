import React from 'react';
import { Truck, PhoneCall, Wallet, ShieldCheck } from 'lucide-react';
import '../styles/Features.css';

const features = [
    {
        icon: <Truck size={26} />,
        title: 'Fast Delivery',
        desc: '4-Hour Express Delivery within city limits',
    },
    {
        icon: <PhoneCall size={26} />,
        title: 'Online Support',
        desc: 'Technical support available 24/7',
    },
    {
        icon: <Wallet size={26} />,
        title: 'Best Prices',
        desc: 'Unbeatable deals and weekly sales',
    },
    {
        icon: <ShieldCheck size={26} />,
        title: 'Trusted Quality',
        desc: 'Certified products from top brands',
    },
];

const Features = () => {
    return (
        <div className="features-strip">
            <h2 className="features-heading">Why Shop with us?</h2>
            <div className="features-inner">
                {features.map((f, i) => (
                    <React.Fragment key={i}>
                        <div className="feature-item">
                            <div className="feature-icon">{f.icon}</div>
                            <div className="feature-text">
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                        {i < features.length - 1 && <div className="feature-sep" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Features;
