-- 1. Ensure the Admin Profile exists (resilient to username conflicts)
INSERT INTO public.profiles (id, username, role)
VALUES ('c1beccca-25da-42a5-a6b5-74ad9f646dd1', 'FashionYardAdmin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Innovation Article: The Algorithm of Elegance
INSERT INTO public.posts (
    title, slug, excerpt, meta_title, meta_description, 
    featured_image, category_id, author_id, status, 
    read_time, view_count, content, published_at
) VALUES (
    'The Algorithm of Elegance: How AI is Redefining Haute Couture in 2026',
    'algo-elegance',
    'Exploring the radical shift where generative neural networks meet the traditional silk loom. AI is not just a tool; it is the new master couturier.',
    'AI Fashion Couture 2026 | The Future of Digital Haute Couture',
    'Discover how generative AI and neural design are transforming the luxury fashion industry. Explore the intersection of technology and artisanal craftsmanship.',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    (SELECT id FROM public.categories WHERE slug = 'innovation' LIMIT 1),
    'c1beccca-25da-42a5-a6b5-74ad9f646dd1',
    'published',
    12,
    1540,
    '{
        "sections": [
            {"type": "h2", "text": "The Intersection of Neural Design and Silk Looms"},
            {"type": "p", "text": "The year 2026 marks a pivotal moment in fashion history. We are no longer debating whether technology has a place in the atelier; we are witnessing the birth of a new species of design. The algorithm is no longer a cold processor of data; it has become a co-creator, whispering possibilities that the human mind, bound by its own cognitive biasses, might never have conceived."},
            {"type": "h3", "text": "Why Digital Couture is the New Gold Standard"},
            {"type": "p", "text": "In the past, luxury was defined by its rarity and its physical weight. Today, luxury is defined by its intelligence. Digital couture allows for a level of personalization that was previously reserved for the ultra-elite."},
            {"type": "table", "title": "Comparison: Traditional vs. AI-Driven High Fashion", "headers": ["Feature", "Traditional Couture", "AI-Driven Couture"], "rows": [["Design Origin", "Hand-sketched", "Generative neural collab"], ["Sustainability", "Significant waste", "Zero-waste prototyping"], ["Production", "3-6 months", "Weeks"]]},
            {"type": "faq", "title": "FAQ", "items": [{"q": "Will AI replace designers?", "a": "No, it augments their creative vision."}, {"q": "Is digital fashion real?", "a": "Yes, it is the new digital asset class."}]}
        ]
    }',
    NOW()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;

-- 2. Minimalism Article: The Texture of Silence
INSERT INTO public.posts (
    title, slug, excerpt, meta_title, meta_description, 
    featured_image, category_id, author_id, status, 
    read_time, view_count, content, published_at
) VALUES (
    'The Texture of Silence: Why Quiet Luxury is the Ultimate Status Symbol',
    'quiet-luxury-texture',
    'In a world of loud logos, the most powerful statement is the one whispered through exquisite craftsmanship and the depth of natural fibers.',
    'Quiet Luxury Guide 2026 | Minimalist Fashion Trends & Ethical Luxury',
    'Explore the rise of quiet luxury. Why unbranded, high-quality minimalism is the most powerful statement in modern fashion.',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
    (SELECT id FROM public.categories WHERE slug = 'minimalism' LIMIT 1),
    'c1beccca-25da-42a5-a6b5-74ad9f646dd1',
    'published',
    10,
    1820,
    '{
        "sections": [
            {"type": "h2", "text": "The Psychology of Unbranded Luxury"},
            {"type": "p", "text": "Quiet luxury isn''t just a trend; it''s a philosophical pivot. Affluent consumers are seeking a conversation with the self—recognizing the invisible markers of quality: the weight of 12-ply cashmere and hand-stitched details."},
            {"type": "table", "title": "Essential Materials", "headers": ["Material", "Sustainable Impact"], "rows": [["Vicuna Wool", "Animal conservation"], ["Loro Piana Cashmere", "Ethical herding"]]},
            {"type": "faq", "title": "Minimalism FAQ", "items": [{"q": "How to start?", "a": "Audit your closet and focus on a cohesive color palette."}]}
        ]
    }',
    NOW()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;

-- 3. Culture Article: Heritage Meets Horizon
INSERT INTO public.posts (
    title, slug, excerpt, meta_title, meta_description, 
    featured_image, category_id, author_id, status, 
    read_time, view_count, content, published_at
) VALUES (
    'Heritage Meets Horizon: The Global Shift in Modern Style Capitals',
    'virtual-threads',
    'The digital age has not erased local culture; it has amplified it. From Tokyo street style to Parisian ateliers, heritage is the new innovation.',
    'Global Fashion Trends 2026 | Heritage & Cultural Innovation NYC London Tokyo',
    'A deep dive into how global culture and local heritage are redefining the fashion runways of Tokyo, Paris, and New York in 2026.',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    (SELECT id FROM public.categories WHERE slug = 'culture' LIMIT 1),
    'c1beccca-25da-42a5-a6b5-74ad9f646dd1',
    'published',
    15,
    2150,
    '{
        "sections": [
            {"type": "h2", "text": "The De-Centralization of Style"},
            {"type": "p", "text": "Fashion is no longer a hierarchy led by Paris. It is a decentralized network of stylistic hubs—Lagos, Tokyo, and Seoul—connected by digital storytelling and ancestral heritage."},
            {"type": "table", "title": "City Identities", "headers": ["City", "2026 Identity"], "rows": [["Tokyo", "Functional Tech-Traditionalism"], ["Paris", "Bio-Synthetic Couture"]]},
            {"type": "faq", "title": "Cultural FAQ", "items": [{"q": "Which city is next?", "a": "Lagos and Seoul are seeing the fastest cultural capital growth in 2026."}]}
        ]
    }',
    NOW()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;

-- 4. Style Article: Mastering the Capsule Wardrobe
INSERT INTO public.posts (
    title, slug, excerpt, meta_title, meta_description, 
    featured_image, category_id, author_id, status, 
    read_time, view_count, content, published_at
) VALUES (
    'Mastering the Capsule Wardrobe: An SEO Guide to Sustainable Luxury',
    'capsule-wardrobe-guide',
    'The true mark of a style expert is the ability to create infinite expressions from a finite collection of exquisite pieces.',
    'Capsule Wardrobe Guide 2026 | Sustainable Luxury Fashion Mastery',
    'Learn how to build a high-end capsule wardrobe that balances sustainability with luxury aesthetics.',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    (SELECT id FROM public.categories WHERE slug = 'style' OR name = 'Style' LIMIT 1),
    'c1beccca-25da-42a5-a6b5-74ad9f646dd1',
    'published',
    14,
    1240,
    '{
        "sections": [
            {"type": "h2", "text": "The Architecture of Choice"},
            {"type": "p", "text": "A capsule wardrobe isn''t just about saving space; it''s about the architecture of your identity. By selecting only the most versatile and high-quality items, you ensure that your style is always consistent."},
            {"type": "table", "title": "The Essential List", "headers": ["Item", "Fabric"], "rows": [["Blazers", "Silk-Blend"], ["Sweaters", "Cashmere"]]},
            {"type": "faq", "title": "Style FAQ", "items": [{"q": "Can I use color?", "a": "Yes, pick one accent color to maintain cohesion."}]}
        ]
    }',
    NOW()
) ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
