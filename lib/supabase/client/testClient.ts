import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase環境変数が設定されていません');
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey);
}
