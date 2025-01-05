// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyyafspzaolojytztnpd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eWFmc3B6YW9sb2p5dHp0bnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjEwNzAsImV4cCI6MjA1MTQ5NzA3MH0.zwSRqrdZEb8RbG2FOTwaoWLNGkyWhuc-I-CgBdbPD8M'

export const supabase = createClient(supabaseUrl, supabaseKey)