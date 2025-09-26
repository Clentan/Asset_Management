import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fduhxpdonysbqptulszh.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdWh4cGRvbnlzYnFwdHVsc3poIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU5MTU4NiwiZXhwIjoyMDU3MTY3NTg2fQ.aKMcF3LRrcbu0SM2aCiONXLGcSRagWmXATFCa-8A2lI";
export const supabase = createClient(supabaseUrl, supabaseKey);