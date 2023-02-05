const { SlashCommandBuilder } = require('discord.js');
/**
 * ephemeral messages: https://discordjs.guide/slash-commands/response-methods.html#ephemeral-responses
 * slash commands in bot DM: https://github.com/discord/discord-api-docs/issues/2365
 * 
 * 
 */

//##########################################################################
//# Converts comma separated
//##########################################################################
var formatAffects = (pArg) => {
  let retvalue = "";
  let affectsArr = [];
  let sb = "";
  //let affectBy = /([A-Za-z_\s]+)\s*by\s*([-+]?\d+)/;
  let affectBy = /^([A-Za-z_\s]+)\s*by\s*(.+)$/;
  let match = null;

  affectsArr = pArg.trim().split(",");
  for (let i = 0;i<affectsArr.length;i++){
    if (affectBy.test(affectsArr[i].toString().trim()) )
    {
      match = affectBy.exec(affectsArr[i].toString().trim());
      //console.log("matched: " + affectsArr[i]);
      //console.log(match[1].toUpperCase().padEnd(14) + "by " + match[2]);
      if (match[1].trim() === "casting level" ||
          match[1].trim() === "spell slots" ) //keep these lower case
      {
          sb += "Affects".padEnd(9) + ": " + match[1].trim().padEnd(14) + "by " + match[2] + "\n";
      }
      else if (match[1].trim().toLowerCase().startsWith("skill ")) {  // lore formatting for skills
          sb += "Affects".padEnd(9) + ": " + match[1].trim().toLowerCase().padEnd(20) + "by " + match[2] + "\n";
      }
      else if (match[1].trim().length >= 13) {
        sb += "Affects".padEnd(9) + ": " + match[1].trim().toLowerCase() + " by  " + match[2] + "\n"; // note: 2 trailing spaces after by
      }
      else {
        sb += "Affects".padEnd(9) + ": " + match[1].trim().toUpperCase().padEnd(14) + "by " + match[2] + "\n";
      }
    }
    else {
      //console.log("didn't match: " + affectsArr[i]);       //this is going to be single lines like : regeneration 14%
      sb += "Affects".padEnd(9) + ": " + affectsArr[i].toString().trim() + "\n";
    }
  }
  retvalue = sb;
  return retvalue;
}

/**
 * formats a lore in Arctic format
 */
function formatLore(pArg) {
  let retvalue ='';
	let sb = ''

	sb += `\nObject '${pArg.OBJECT_NAME}'\n`;

  if (pArg.ITEM_TYPE != null) sb += `Item Type: ${pArg.ITEM_TYPE}\n`;
  if (pArg.MAT_CLASS != null) sb += `Mat Class: ${(pArg.MAT_CLASS).padEnd(13)}Material : ${pArg.MATERIAL}\n`;
  if (pArg.WEIGHT    != null) sb += `Weight   : ${(pArg.WEIGHT.toString()).padEnd(13)}Value    : ${pArg.ITEM_VALUE}\n`;
  if (pArg.AFFECTS   != null) sb += `${formatAffects(pArg.AFFECTS)}`;
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
		let replyMsg =''
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
//				let replyMsg = ''
				if (data.data.length === 0) {
				  replyMsg = "0 item(s) found for '" + interaction.options.getString('item') + "'\n"	
				}
				else {
          if ( data.meta.loreCount === 1) {
            replyMsg = "1 item found for '" + interaction.options.getString('item') + "'\n"
          }
          else {
            replyMsg = data.meta.loreCount + " items found for '" + interaction.options.getString('item') + "'\n"
          }
				  for (let i = 0; i < data.data.length; i++) {
					  replyMsg += formatLore(data.data[i]);
		  	  }
	      }
        interaction.reply({ content: "```" + replyMsg + "```" , ephemeral: true});
			})

	  //await interaction.reply({ content: "```" + replyMsg + "```" , ephemeral: true});
	
		//#console.log('loreURL: ' + loreURL)
		/*await interaction.reply({ content: "`1 item found for '" + interaction.options.getString('item') + "'`"
								, ephemeral: true
							    });
									*/
		/*
		await interaction.followUp({content: "```" + interaction.options.getString('item') + "```"
								  , ephemeral: true
								   });
	  */
	},
};
