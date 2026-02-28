import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SubscriptionPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if user has already seen the popup in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');

        if (!hasSeenPopup) {
            // Trigger after 10 seconds
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem('hasSeenPopup', 'true');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Simulate API call
        setIsSubmitted(true);

        // Auto close after success message
        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-brand-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                        >
                            <X className="w-4 h-4 text-brand-black" />
                        </button>

                        {/* Left Image Side */}
                        <div className="md:w-1/2 relative h-64 md:h-auto">
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                                alt="Fashion Editorial"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-brand-black/20" />
                        </div>

                        {/* Right Content Side */}
                        <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ArrowRight className="w-8 h-8 text-brand-accent -rotate-45" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold text-brand-black">Welcome to the Archive.</h3>
                                    <p className="text-black/50 text-sm font-medium">Your exclusive access code has been sent to your inbox.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">Exclusive Dispatch</span>
                                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-black mb-4 leading-tight">
                                        Gain Access to the Unseen.
                                    </h2>
                                    <p className="text-black/50 text-sm font-medium leading-relaxed mb-8">
                                        Join our private editorial club. Receive 15% off your first archival acquisition and early access to curated drops.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="ENTER EMAIL ADDRESS"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-brand-gray border border-black/10 rounded-full px-6 py-4 text-xs font-bold tracking-widest text-brand-black placeholder:text-black/30 focus:outline-none focus:border-brand-accent transition-colors"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full relative group overflow-hidden bg-brand-black text-white rounded-full px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                Unlock Access <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                        </button>
                                        <p className="text-center mt-6 text-[9px] font-bold uppercase tracking-widest text-black/30">
                                            By entering your email you agree to our terms.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
