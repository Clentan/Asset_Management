
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fduhxpdonysbqptulszh.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWh4cGRvbnlzYnFwdHVsc3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTE1ODYsImV4cCI6MjA1NzE2NzU4Nn0.9fVABM_aQuEKJGstpXlzh_fb3tDk5J0oCUWG8V3m5pA"
export const supabase = createClient(supabaseUrl, supabaseKey);
