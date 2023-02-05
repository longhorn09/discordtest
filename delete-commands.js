"use strict";
const {REST, Routes} = require('discord.js');
//const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
require('dotenv/config')

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// for deletion
/**
 * https://discordjs.guide/slash-commands/deleting-commands.html#deleting-specific-commands
 */
(async () => {
	try {
		// for guild-based commands 
		const data = await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_OWNERID, process.env.DISCORD_GUILDID), { body: [] })
	              .then(() => console.log('Successfully deleted all guild commands.'))
	              .catch(console.error);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
