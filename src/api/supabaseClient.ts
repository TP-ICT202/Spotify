import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Création du client Supabase (singleton)
// Une seule instance partagée par toute l'app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


