


//sætter supabase op mere direkte, uden at bruge .env, da det ikke virker i browseren.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  "https://aawikhhqhcwurayjzpog.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd2lraGhxaGN3dXJheWp6cG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTg0ODQsImV4cCI6MjA4ODI3NDQ4NH0.ugLshUaikbwsnSQBPTzVUpONU8e3vNaRw2rc3pWLkd4"
);

export { supabase };