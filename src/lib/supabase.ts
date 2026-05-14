// Eski dosyalar `import { supabase } from '@/lib/supabase'` şeklinde import ediyor.
// Bu dosya o import'u browser client'a yönlendirir.
// SERVER tarafında supabase işlemi için: import { createClient } from '@/lib/supabase/server'
export { supabase } from './supabase/client';
