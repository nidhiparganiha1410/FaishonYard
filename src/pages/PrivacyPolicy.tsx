import React from 'react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-brand-white">
            <section className="relative h-[40vh] bg-brand-black flex items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl px-6">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[0.9] tracking-tighter">Privacy Policy</h1>
                    <p className="text-white/40 text-sm mt-6 uppercase tracking-widest">Last updated: March 1, 2026</p>
                </motion.div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-24 space-y-10 text-black/70 leading-relaxed">
                <h2 className="text-2xl font-serif font-bold text-black">Introduction</h2>
                <p>Fashion Yard ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>

                <h2 className="text-2xl font-serif font-bold text-black">Information We Collect</h2>
                <p>We may collect information you voluntarily provide, including your name, email address, and any messages you send through our contact forms. We also collect usage data through cookies and analytics tools to improve your browsing experience.</p>

                <h2 className="text-2xl font-serif font-bold text-black">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>To provide and maintain our editorial content</li>
                    <li>To send you newsletters if you've subscribed</li>
                    <li>To respond to your inquiries and support requests</li>
                    <li>To analyze website traffic and improve user experience</li>
                    <li>To comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-serif font-bold text-black">Cookies</h2>
                <p>We use cookies and similar tracking technologies to analyze trends, administer the website, and gather demographic information. You can control cookie preferences through your browser settings.</p>

                <h2 className="text-2xl font-serif font-bold text-black">Third-Party Links</h2>
                <p>Our website may contain affiliate links and links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>

                <h2 className="text-2xl font-serif font-bold text-black">Contact Us</h2>
                <p>If you have questions about this privacy policy, please contact us at <a href="/contact" className="text-brand-accent hover:underline">our contact page</a>.</p>
            </section>
        </main>
    );
}
