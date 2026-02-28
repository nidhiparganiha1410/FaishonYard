import React from 'react';
import { motion } from 'motion/react';

const BRANDS = [
    { name: 'Gucci', offer: 'Up to 40% Off', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/200px-1960s_Gucci_Logo.svg.png' },
    { name: 'Prada', offer: 'New Arrivals', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Prada-Logo.svg/200px-Prada-Logo.svg.png' },
    { name: 'Versace', offer: 'Spring Sale', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Versace_logo.png/200px-Versace_logo.png' },
    { name: 'Dior', offer: 'Exclusive Deals', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dior_Logo.svg/200px-Dior_Logo.svg.png' },
    { name: 'Chanel', offer: '30% Off Select', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Chanel_logo-no-words.svg/200px-Chanel_logo-no-words.svg.png' },
    { name: 'Burberry', offer: 'Free Shipping', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Burberry_Logo.svg/200px-Burberry_Logo.svg.png' },
    { name: 'Louis Vuitton', offer: 'Limited Edition', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/200px-Louis_Vuitton_logo_and_wordmark.svg.png' },
    { name: 'Hermès', offer: 'Season Bestsellers', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Herm%C3%A8s_Paris.svg/200px-Herm%C3%A8s_Paris.svg.png' },
];

export default function BrandsSlider() {
    return (
        <section className="bg-brand-gray py-20 overflow-hidden border-t border-black/5">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-4 block">Partnered Brands</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">Top Brands & Offers</h2>
            </div>

            {/* Infinite scroll track */}
            <div className="relative">
                <div className="flex animate-marquee">
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <motion.div
                            key={`${brand.name}-${i}`}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="flex-none w-[200px] mx-6 bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-black/5 hover:shadow-xl transition-shadow duration-500 cursor-pointer group"
                        >
                            <div className="w-20 h-16 flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-serif font-bold text-black/20">${brand.name[0]}</span>`;
                                    }}
                                />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-1">{brand.name}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{brand.offer}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
