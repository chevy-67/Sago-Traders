import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <p className="text-lg text-gray-500 mb-8">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center">
                            <Mail className="text-blue-600 mr-4" size={24} />
                            <span className="text-gray-700">contact@sagotraders.com</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="text-blue-600 mr-4" size={24} />
                            <span className="text-gray-700">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="text-blue-600 mr-4" size={24} />
                            <span className="text-gray-700">123 Business Ave, Tech City, TC 90210</span>
                        </div>
                    </div>
                </div>

                <form className="bg-white shadow-lg rounded-lg p-8">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your Name" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" rows="4" placeholder="How can we help?"></textarea>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition" type="button">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
