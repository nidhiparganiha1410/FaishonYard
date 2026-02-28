import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing post ID' });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('view_count')
            .eq('id', id)
            .single();

        if (!error && data) {
            await supabaseAdmin
                .from('posts')
                .update({ view_count: data.view_count + 1 })
                .eq('id', id);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to increment view count' });
    }
}
