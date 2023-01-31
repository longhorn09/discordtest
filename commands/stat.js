const { SlashCommandBuilder } = require('discord.js');
/**
 * ephemeral messages: https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
 * slash commands in bot DM: https://github.com/discord/discord-api-docs/issues/2365
 * 
 * 
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stat')
		.setDescription('Provides lore stats about object(s)')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('example: bronze.shield')
				.setRequired(true)),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await fetch("http://127.0.0.1:8080/api/v1/stat/" + interaction.options.getString('item') + "/1")
		console.log("http://127.0.0.1:8080/api/v1/stat/" + interaction.options.getString('item') + "/1")
		await interaction.reply({ content: "`1 item found for '" + interaction.options.getString('item') + "'`"
								, epheremal: true
							    });
		await interaction.followUp({content: "```" + interaction.options.getString('item') + "```"
								  , ephemeral: true
								   });
		//USER:   await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
		//SERVER: await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);		
	},
};