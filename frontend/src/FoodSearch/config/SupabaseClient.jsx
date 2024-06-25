import { createClient } from '@supabase/supabase-js';

//to check that the reference is being imported 
//console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
//console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseURL, supabaseKey)

export default supabase