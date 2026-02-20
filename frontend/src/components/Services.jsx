import React from 'react';
import { CheckCircle } from 'lucide-react';

const servicesList = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Cloud Consulting',
    'SEO Optimization',
    'Data Analytics'
];

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Services</h1>
            <p className="text-xl text-gray-500 mb-12">
                We offer a wide range of services to help your business grow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesList.map((service, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-start">
                        <CheckCircle className="text-green-500 mr-4 flex-shrink-0" size={24} />
                        <span className="text-lg font-medium text-gray-900">{service}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
