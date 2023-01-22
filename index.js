/** 
 * boiler plate: https://www.youtube.com/watch?v=qRMVNtIF73c
 * registering global slashcommand: https://www.youtube.com/watch?v=ZtDtjjUHbIg&t=492s
 */ 


//const { Client, Events, GatewayIntentBits } = require('discord.js')
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}



client.on('messageCreate', (message) => {
  if (message.content === 'ping') {
    message.reply('reply pong')
    message.channel.send("channel pong")
    message.author.send("direct pong")
  }
})
/*
client.on(Events.MessageCreate, (message) => {
  if (message.content === 'ping') {
    //message.reply('reply pong')
    //message.channel.send("channel pong")
    message.author.send("direct pong")
  }
});*/

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
  //console.log(interaction.commandName)
	if (!command) {
    return;
  }

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.DISCORD_TOKEN)

client.on(Events.ClientReady, () => {
  console.log('The bot is ready')
})