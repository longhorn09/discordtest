const { SlashCommandBuilder } = require('discord.js');
/**
 * ephemeral messages: https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
 * slash commands in bot DM: https://github.com/discord/discord-api-docs/issues/2365
 * 
 * 
 */
function formatLore(pArg) {
  let retvalue ='';
	let sb = ''

	sb += `\nObject '${pArg.OBJECT_NAME}'\n`;

  if (pArg.ITEM_TYPE != null) sb += `Item Type: ${pArg.ITEM_TYPE}\n`;
  if (pArg.MAT_CLASS != null) sb += `Mat Class: ${(pArg.MAT_CLASS).padEnd(13)}Material : ${pArg.MATERIAL}\n`;
  if (pArg.WEIGHT    != null) sb += `Weight   : ${(pArg.WEIGHT.toString()).padEnd(13)}Value    : ${pArg.ITEM_VALUE}\n`;
  //if (pArg.AFFECTS   != null) sb += `${formatAffects(pArg.AFFECTS)}`;
  if (pArg.SPEED     != null) sb += `Speed    : ${pArg.SPEED}\n`;
  if (pArg.POWER     != null) sb += `Power    : ${pArg.POWER}\n`;
  if (pArg.ACCURACY  != null) sb += `Accuracy : ${pArg.ACCURACY}\n`;
  if (pArg.EFFECTS   != null) sb += `Effects  : ${pArg.EFFECTS}\n`;
  if (pArg.ITEM_IS   != null) sb += `Item is  : ${pArg.ITEM_IS.toUpperCase()}\n`;
  if (pArg.CHARGES   != null) sb += `Charges  : ${pArg.CHARGES}\n`;
  if (pArg.ITEM_LEVEL!= null) sb += `Level    : ${pArg.ITEM_LEVEL}\n`;
  if (pArg.RESTRICTS != null) sb += `Restricts: ${pArg.RESTRICTS.toUpperCase()}\n`;
  if (pArg.IMMUNE    != null) sb += `Immune   : ${pArg.IMMUNE}\n`;
  if (pArg.APPLY     != null) sb += `Apply    : ${pArg.APPLY}\n`;
  if (pArg.CLASS     != null) sb += `Class    : ${pArg.CLASS}\n`;
  if (pArg.DAMAGE    != null) sb +=        `Damage   : ${pArg.DAMAGE}\n`;
  if (pArg.CONTAINER_SIZE   != null) sb += `Contains : ${pArg.CONTAINER_SIZE}\n`;
  if (pArg.CAPACITY    != null) sb +=      `Capacity : ${pArg.CAPACITY}\n`;

  if (pArg.SUBMITTER != null) sb += `Submitter: ${pArg.SUBMITTER} (${pArg.CREATE_DATE})\n`;

	retvalue = sb;
	return retvalue;
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
				//formatLore(data)
				let replyMsg = ''
				if (data.data.length === 0) {
				  replyMsg = "0 item(s) found for '" + interaction.options.getString('item') + "'"	
				}
				else {
				  for (let i = 0; i < data.data.length; i++) {
					  replyMsg += formatLore(data.data[i]);
		  	  }
	      }
        interaction.reply({ content: "```" + replyMsg + "```" , epheremal: true});
			})
		
		//#console.log('loreURL: ' + loreURL)
		/*await interaction.reply({ content: "`1 item found for '" + interaction.options.getString('item') + "'`"
								, epheremal: true
							    });
									*/
		/*
		await interaction.followUp({content: "```" + interaction.options.getString('item') + "```"
								  , ephemeral: true
								   });
	  */
	},
};
