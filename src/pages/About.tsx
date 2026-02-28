import React from 'react';
import { motion } from 'motion/react';

export default function About() {
    return (
        <main className="min-h-screen bg-brand-white">
            <section className="relative h-[50vh] bg-brand-black flex items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl px-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-6 block">Our Story</span>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter">About Fashion Yard</h1>
                </motion.div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
                <div className="space-y-6 text-lg text-black/70 leading-relaxed font-serif">
                    <p className="text-2xl font-light italic text-black/50">"Where luxury meets digital editorial — curated for the discerning eye."</p>
                    <p>Fashion Yard is a luxury editorial blogging and affiliate marketing platform with a minimalist aesthetic. Founded in 2024, we bridge the gap between high fashion, emerging designers, and a global audience of style enthusiasts.</p>
                    <p>Our editorial team curates stories that explore the intersection of innovation, sustainability, and timeless design. From runway coverage to deep dives into the craftsmanship behind luxury goods, every story is crafted with precision and purpose.</p>
                    <h2 className="text-3xl font-serif font-bold mt-16 mb-4">Our Mission</h2>
                    <p>To democratize access to luxury fashion knowledge while celebrating the artisans, designers, and visionaries who shape the industry. We believe in quality over quantity, substance over spectacle.</p>
                    <h2 className="text-3xl font-serif font-bold mt-16 mb-4">The Team</h2>
                    <p>Our diverse team of fashion journalists, photographers, and technologists work together to bring you the most compelling stories from the world of luxury fashion. Based across major fashion capitals, we maintain an ear to the ground and an eye on the horizon.</p>
                </div>
            </section>
        </main>
    );
}
