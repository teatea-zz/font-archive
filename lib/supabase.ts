import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// 클라이언트용 Supabase (권한 제한됨 - RLS 적용)
export const supabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// 서버용 Supabase (전체 권한 - RLS 우회)
export const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
