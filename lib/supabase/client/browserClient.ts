import { createBrowserClient } from "@supabase/ssr";
import { createClient as browserClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
