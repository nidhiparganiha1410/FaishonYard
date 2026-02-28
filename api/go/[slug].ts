import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Missing slug' });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('affiliate_links')
            .select('destination_url, click_count')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return res.status(404).send('Link not found');
        }

        // Increment click count
        await supabaseAdmin
            .from('affiliate_links')
            .update({ click_count: data.click_count + 1 })
            .eq('slug', slug);

        res.redirect(301, data.destination_url);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}
