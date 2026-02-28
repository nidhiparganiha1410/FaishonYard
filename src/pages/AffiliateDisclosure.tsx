import React from 'react';
import { motion } from 'motion/react';

export default function AffiliateDisclosure() {
    return (
        <main className="min-h-screen bg-brand-white">
            <section className="relative h-[40vh] bg-brand-black flex items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl px-6">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[0.9] tracking-tighter">Affiliate Disclosure</h1>
                    <p className="text-white/40 text-sm mt-6 uppercase tracking-widest">Last updated: March 1, 2026</p>
                </motion.div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-24 space-y-10 text-black/70 leading-relaxed">
                <h2 className="text-2xl font-serif font-bold text-black">Transparency Statement</h2>
                <p>Fashion Yard is committed to editorial integrity and transparency. Some of the links on our website are affiliate links, meaning we may earn a commission if you click through and make a purchase at no additional cost to you.</p>

                <h2 className="text-2xl font-serif font-bold text-black">How Affiliate Links Work</h2>
                <p>When you click on an affiliate link on Fashion Yard and make a purchase, the retailer may pay us a small percentage of the sale. This helps us maintain and grow our editorial platform, allowing us to continue producing high-quality fashion content for our readers.</p>

                <h2 className="text-2xl font-serif font-bold text-black">Our Promise</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>We only recommend products we genuinely believe in</li>
                    <li>Affiliate relationships never influence our editorial opinions</li>
                    <li>We always disclose when content contains affiliate links</li>
                    <li>Our reviews and recommendations are based on merit, not commission rates</li>
                </ul>

                <h2 className="text-2xl font-serif font-bold text-black">Questions?</h2>
                <p>If you have questions about our affiliate relationships, please visit our <a href="/contact" className="text-brand-accent hover:underline">contact page</a>.</p>
            </section>
        </main>
    );
}
