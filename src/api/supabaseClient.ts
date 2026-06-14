import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

console.log('🔍 SUPABASE_URL:', SUPABASE_URL);
console.log('🔍 SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'définie' : 'NON DÉFINIE');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);