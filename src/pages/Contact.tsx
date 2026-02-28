import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <main className="min-h-screen bg-brand-white">
            <section className="relative h-[50vh] bg-brand-black flex items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl px-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">Get In Touch</span>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter">Contact Us</h1>
                </motion.div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-serif font-bold">We'd love to hear from you</h2>
                        <p className="text-black/60 leading-relaxed">Whether you have a question about editorial collaborations, partnerships, or advertising — our team is ready to assist.</p>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <Mail className="w-5 h-5 mt-1 text-brand-accent" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Email</h4>
                                    <p className="text-black/60">hello@fashionyard.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-5 h-5 mt-1 text-brand-accent" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Location</h4>
                                    <p className="text-black/60">New Delhi, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block">Name</label>
                            <input type="text" className="w-full border border-black/10 rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-brand-accent transition-colors" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block">Email</label>
                            <input type="email" className="w-full border border-black/10 rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-brand-accent transition-colors" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest mb-2 block">Message</label>
                            <textarea className="w-full border border-black/10 rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-brand-accent transition-colors min-h-[150px]" placeholder="How can we help?" />
                        </div>
                        <button className="w-full py-4 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
