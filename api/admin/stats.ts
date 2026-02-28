import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const [posts, users, views] = await Promise.all([
            supabaseAdmin.from('posts').select('id', { count: 'exact' }),
            supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
            supabaseAdmin.from('posts').select('view_count'),
        ]);

        const totalViews = views.data?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;

        res.json({
            totalPosts: posts.count,
            totalUsers: users.count,
            totalViews,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
