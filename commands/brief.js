const { SlashCommandBuilder } = require('discord.js');
var moment = require('moment');

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
		let replyMsg =''
		let loreURL = "http://127.0.0.1:8080/api/v1/brief/" + interaction.options.getString('item') 

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
					  replyMsg += data.data[i].OBJECT_NAME + "\n";
		  	  }
	      }
        dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(`${dateTime} : ${interaction.user.username.toString().padEnd(30)} /brief ${interaction.options.getString('item')}`)
        interaction.reply({ content: "```" + replyMsg + "```" , ephemeral: true});
			})
	},
};

/*
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
    let dateTime = ''
		let replyMsg =''
		let loreURL = "http://127.0.0.1:8080/api/v1/stat/" + interaction.options.getString('item') + "/1"

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
        dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(`${dateTime} : ${interaction.user.username.toString().padEnd(30)} /stat ${interaction.options.getString('item')}`)
        interaction.reply({ content: "```" + replyMsg + "```" , ephemeral: true});
			})
	},
};
*/
