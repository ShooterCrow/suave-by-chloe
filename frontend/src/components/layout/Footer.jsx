import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full pt-20 pb-8 px-4 md:px-8 border-t mt-auto border-gray-200 bg-white text-gray-600 dark:border-white/10 dark:bg-[#030304] dark:text-gray-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                {/* 1. Brand & Description */}
                <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                        Suave By Chloe.
                    </h3>
                    <p className="text-sm leading-relaxed font-sans opacity-80 max-w-xs">
                        Experience the pinnacle of luxury and modern design. Your sanctuary in the digital age.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon icon={<Facebook size={18} />} />
                        <SocialIcon icon={<Twitter size={18} />} />
                        <SocialIcon icon={<Instagram size={18} />} />
                    </div>
                </div>

                {/* 2. Quick Links */}
                <div>
                    <h4 className="font-mono text-sm font-bold tracking-widest uppercase mb-4 text-gray-900 dark:text-white">
                        Policies
                    </h4>
                    <ul className="space-y-4 text-sm font-sans">
                        {['Cancellation Policy', 'Check-in/Out Policy', 'House Rules'].map((item) => (
                            <li key={item}>
                                <a href={`/policies#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                                    <span className="w-0 group-hover:w-2 h-[1px] bg-blue-500 transition-all duration-300" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <h4 className="mt-5 font-mono text-sm font-bold tracking-widest uppercase mb-4 text-gray-900 dark:text-white">
                        Legal
                    </h4>
                    <ul className="space-y-4 text-sm font-sans">
                        {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-2 group">
                                    <span className="w-0 group-hover:w-2 h-[1px] bg-blue-500 transition-all duration-300" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Contact Info */}
                <div>
                    <h4 className="font-mono text-sm font-bold tracking-widest uppercase mb-6 text-gray-900 dark:text-white">
                        Contact
                    </h4>
                    <ul className="space-y-4 text-sm font-sans">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <span>Kubwa, Abuja,<br />Nigeria</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-blue-500 shrink-0" />
                            <span>+234 800 123 4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-blue-500 shrink-0" />
                            <span>reservations@suavebychloe.com</span>
                        </li>
                    </ul>
                </div>

                {/* 4. Newsletter */}
                <div>
                    <h4 className="font-mono text-sm font-bold tracking-widest uppercase mb-6 text-gray-900 dark:text-white">
                        Newsletter
                    </h4>
                    <p className="text-sm mb-4 opacity-80">
                        Subscribe for exclusive offers and updates.
                    </p>
                    <form className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 rounded-lg text-sm outline-none border transition-all bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-400 dark:bg-white/5 dark:border-white/10 dark:focus:border-blue-500 dark:text-white dark:placeholder-gray-500"
                        />
                        <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group">
                            Subscribe
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono opacity-60 border-gray-200 dark:border-white/10">
                <p>© {currentYear} Suave By Chloe Hotel. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Sitemap</a>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a
        href="#"
        className="p-2 rounded-full border transition-all duration-300 border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-blue-400 hover:text-blue-600 dark:border-white/20 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:border-white/40 dark:hover:text-white"
    >
        {icon}
    </a>
);

export default Footer;
