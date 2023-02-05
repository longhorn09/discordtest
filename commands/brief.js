const {EmbedBuilder,  SlashCommandBuilder } = require('discord.js');

var moment = require('moment');

const embedObj = new EmbedBuilder()
/**
 * handles /brief
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('brief')
		.setDescription('Provides of list of lore names only to help narrow selection with /stat or /query')
	  .setDMPermission(true)
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('example: bronze.shield')
				.setRequired(true)),
	async execute(interaction) {
    let dateTime = ''
		let titleMsg = '', 
			  embedMsg = '';
		let loreURL = "http://" + process.env.DATABASE_IP + "/api/v1/brief/" + interaction.options.getString('item') 

		//console.log(loreURL)

		await fetch(loreURL, {method: 'GET'}).then(
			res => {
				if (res.ok) {  // note: response object contains entire HTTP response including headers
					return res.json()
				} else {
					console.log("error")
				}
			})
			.then(data => {
				if (data.data.length === 0) {
				  titleMsg = "0 item(s) found for '`" + interaction.options.getString('item') + "`'"	
				}
				else {
          if ( data.meta.loreCount === 1) {
            titleMsg = "1 item found for '`" + interaction.options.getString('item') + "`'"
          }
					else if (data.meta.loreCount > 40) {
            titleMsg = data.meta.loreCount + " items found for '`" + interaction.options.getString('item') + "`'. Displaying first " 
							+ Math.min(40, data.meta.loreCount) +  " items."
          }
					else if (data.meta.loreCount <= 40) {
					  titleMsg = data.meta.loreCount + " items found for '`" + interaction.options.getString('item') + "`'"
					}
					
					// loop thru lores
				  for (let i = 0; i < data.data.length; i++) {
						embedMsg += "`Object`[`" + data.data[i].OBJECT_NAME.toString().trim() + "`](http://www.normstorm.com)\n"
		  	  }
					//console.log(embedMsg)
           
					embedObj.setTitle("" + titleMsg + "" )
					embedObj.setDescription(embedMsg );
       
	      }
        dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(`${dateTime} : ${interaction.user.username.toString().padEnd(30)} /brief ${interaction.options.getString('item')}`)
				
				interaction.reply({embeds: [embedObj], ephemeral: true})
			})
	},
};

