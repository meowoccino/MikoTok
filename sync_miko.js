const { createClient } = require('@supabase/supabase-js');
const { Client, GatewayIntentBits } = require('discord.js');

// Initialize Clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function runSync() {
  try {
    console.log("Connecting to Discord...");
    await discord.login(process.env.DISCORD_BOT_TOKEN);

    const channel = await discord.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    if (!channel) throw new Error("Could not find channel.");

    const messages = await channel.messages.fetch({ limit: 100 });
    console.log(`Raw messages fetched from Discord: ${messages.size}`);
    
    // SMART FILTER: Checks for raw text FIRST. If empty, tries to read the Embed text instead!
    const recentMessages = messages.map(m => {
      let textToSave = m.content;
      
      // If content is empty, dig into the Discord Embeds to find the forwarded text
      if (!textToSave && m.embeds && m.embeds.length > 0) {
        textToSave = m.embeds[0].description || m.embeds[0].title || '';
      }

      return {
        id: m.id,
        content: textToSave,
        created_at: new Date(m.createdTimestamp).toISOString()
      };
    }).filter(m => m.content && m.content.trim().length > 0);

    if (recentMessages.length > 0) {
      console.log(`Found ${recentMessages.length} valid messages. Syncing to Supabase...`);
      
      const { error } = await supabase
        .from('discord_feed')
        .upsert(recentMessages, { onConflict: 'id' });

      if (error) throw error;
      
      const oldestDate = recentMessages[recentMessages.length - 1].created_at;
      const { error: cleanError } = await supabase
        .from('discord_feed')
        .delete()
        .lt('created_at', oldestDate); 

      if (cleanError) throw cleanError;

      console.log("Success! Messages synced and old database entries cleaned up.");
    } else {
      console.log("No new text messages or embeds found in channel.");
    }

  } catch (err) {
    console.error("Sync Failed:", err.message);
    process.exit(1);
  } finally {
    discord.destroy();
  }
}

// THIS IS THE CRITICAL LINE THAT WAS MISSING!
runSync();
