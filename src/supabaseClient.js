import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dbwnepwcjixshjsqqshc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid25lcHdjaml4c2hqc3Fxc2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjE2MzYsImV4cCI6MjA4Njg5NzYzNn0.PYMhEj9q0csXMO6iE7JtOirhP8POSij0jA8wtbcKEPk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
