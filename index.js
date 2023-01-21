// https://www.youtube.com/watch?v=qRMVNtIF73c

const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
})

client.on('ready', () => {
  console.log('The bot is ready')
})

client.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.reply('reply pong')
    message.channel.send("channel pong")
    message.author.send("direct pong")
  }
})

client.login(process.env.DISCORD_TOKEN)
