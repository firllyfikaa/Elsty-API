import { supabase } from './supabase';

export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};