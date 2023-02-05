const { SlashCommandBuilder } = require('discord.js');
/**
 * ephemeral messages: https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
 * slash commands in bot DM: https://github.com/discord/discord-api-docs/issues/2365
 * 
 * 
 */
function formatLore(pArg) {
  let sb ='';

	if (pArg != null) {
		if (pArg.data.length > 0) {
			for (let i = 0; i < Math.min(pArg.data.length,3); i++) {
				sb = ''
			}
		}
	}
	return sb;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stat')
		.setDescription('Provides lore stats about object(s)')
	  .setDMPermission(true)
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('example: bronze.shield')
				.setRequired(true)),
	async execute(interaction) {
		let loreURL = "http://127.0.0.1:8080/api/v1/stat/" + interaction.options.getString('item') + "/1"
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await fetch(loreURL, {method: 'GET'}).then(
			res => {
				if (res.ok) {  // note: response object contains entire HTTP response including headers
					return res.json()
				} else {
					console.log("error")
				}
			})
			.then(data => {
				//console.log(data.jsonData)//[0])
				formatLore(data)
				for (let i = 0; i < 3; i++) {
				console.log(data.data[i].OBJECT_NAME)	
		  	}
			})
		
		//#console.log('loreURL: ' + loreURL)
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
