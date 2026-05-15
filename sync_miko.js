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

    // Fetch the last 100 messages to ensure we get something
    const messages = await channel.messages.fetch({ limit: 100 });
    
    // 🕵️ DEBUG LINE: This will tell us if Discord is blocking the bot from seeing messages!
    console.log(`Raw messages fetched from Discord: ${messages.size}`);
    
    // Filter to get messages actually sent by a person (ignoring bots and empty image posts)
    const recentMessages = messages.map(m => ({
      id: m.id,
      content: m.content,
      created_at: new Date(m.createdTimestamp).toISOString()
    })).filter(m => m.content && m.content.length > 0);

    if (recentMessages.length > 0) {
      console.log(`Found ${recentMessages.length} text messages. Syncing to Supabase...`);
      
      // Upsert into your actual 'discord_feed' table
      const { error } = await supabase
        .from('discord_feed')
        .upsert(recentMessages, { onConflict: 'id' });

      if (error) throw error;
      
      // 🧹 NEW: Auto-delete old messages to keep a rolling window!
      // Finds the date of the oldest message we just grabbed, and deletes anything older in the database.
      const oldestDate = recentMessages[recentMessages.length - 1].created_at;
      const { error: cleanError } = await supabase
        .from('discord_feed')
        .delete()
        .lt('created_at', oldestDate); 

      if (cleanError) throw cleanError;

      console.log("Success! Messages synced and old database entries cleaned up.");
    } else {
      console.log("No new text messages found in channel. (Check Discord Intents or Channel Permissions!)");
    }

  } catch (err) {
    console.error("Sync Failed:", err.message);
    process.exit(1);
  } finally {
    discord.destroy();
  }
}

runSync();
