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

    // Fetch the last 5 messages to ensure we get something
    const messages = await channel.messages.fetch({ limit: 5 });
    
    // Filter to get messages actually sent by a person (ignoring bots)
    const recentMessages = messages.map(m => ({
      id: m.id,
      content: m.content,
      created_at: new Date(m.createdTimestamp).toISOString()
    })).filter(m => m.content.length > 0);

    if (recentMessages.length > 0) {
      console.log(`Found ${recentMessages.length} messages. Syncing to Supabase...`);
      
      // Upsert into your actual 'discord_feed' table
      const { error } = await supabase
        .from('discord_feed')
        .upsert(recentMessages, { onConflict: 'id' });

      if (error) throw error;
      console.log("Success! Messages synced.");
    } else {
      console.log("No new text messages found in channel.");
    }

  } catch (err) {
    console.error("Sync Failed:", err.message);
    process.exit(1);
  } finally {
    discord.destroy();
  }
}

runSync();
