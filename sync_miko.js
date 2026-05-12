
const { createClient } = require('@supabase/supabase-js');

async function runSync() {
  const supabase = createClient('https://yhxcuayiwqpjvalyrcqv.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (process.env.MANUAL_TEXT) {
    await supabase.from('posts').insert([{
      author: 'CodeMiko',
      text: process.env.MANUAL_TEXT,
      source: process.env.MANUAL_SOURCE || 'discord',
      created_at: new Date().toISOString()
    }]);
    console.log("Discord message synced to site!");
  }
}
runSync();
