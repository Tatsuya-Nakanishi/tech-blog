'use server';

import { createClient } from '@/lib/supabase/client/serverClient';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error.message);
    throw new Error(error.message);
  }

  redirect('/');
}
