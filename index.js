/** 
 * boiler plate: https://www.youtube.com/watch?v=qRMVNtIF73c
 * registering global slashcommand: https://www.youtube.com/watch?v=ZtDtjjUHbIg&t=492s
 */ 


//const { Client, Events, GatewayIntentBits } = require('discord.js')
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js') // need Partials for bot to respond to DMs
require('dotenv/config')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// in discordjs version 13+, replace "message" with "messageCreate"
client.on('messageCreate', (message) => {
  let cmd = "";
  let parsedCmd = ""
  let isDM = false

//  if (!message.guild && message.author.username != process.env.BOT_NAME) {
  if (!message.guild && message.author.id != process.env.DISCORD_OWNERID) {
    isDM = true
   // message.reply({content: "direct DM detected", ephmeral: true});
  }

  /*if (message.content === 'ping') {
    message.reply('reply pong')
    message.channel.send("channel pong")
    message.author.send("direct pong")
  
  }
  */

  if (message.content.startsWith(process.env.DISCORD_PREFIX)) {
    cmd = message.content.substring(1,message.content.length);
    parsedCmd = cmd.split(" ")[0];

    switch(parsedCmd) {
      case "help":
        message.reply({ content: "Use `/help` instead, `!help` is deprecated", ephmeral: true});
        break;
      case "stat":
        if (message.content.toString().match(/^!stat\s+(.+)$/)) {
//          message.reply({ content: "Use `/stat " + /^!stat\s+(.+)$/.exec(message.content.toString())[1] + "` instead, `!stat` is deprecated", ephmeral: true});
            message.reply({ content: "`!stat` is deprecated. Use ```/stat " + /^!stat\s+(.+)$/.exec(message.content.toString())[1] + "```", ephmeral: true});
       }
        else {
          message.reply({ content: "Use `/stat` instead, `!stat` is deprecated", ephmeral: true});
        }
      default: 
        break;
    }
  }
  else if (message.content.trim().indexOf("Object '") >= 0   //need to do this way because lore might be pasted in middle of conversation
       // && message.author.username.substring(0,botname.length).toLowerCase() !== botname)
        && message.author.id != process.env.DISCORD_OWNERID)
  {
    let loreArr = null, cleanArr = [];
    //need to scrub the lore message for processing
    loreArr = message.content.trim().split("Object '");
    for (let i = 0 ; i < loreArr.length; i++)  {
      if (loreArr[i].indexOf("'") > 0 && loreArr[i].indexOf(":"))
      {
        //console.log(`loreArr[${i}]: ${loreArr[i]}`);
        cleanArr.push(`Object '${loreArr[i].trim()}`);
      }
    }
    for (let i = 0 ;i < cleanArr.length;i++) {
        //console.log(`cleanArr[${i}]: ${cleanArr[i]}`);
        console.log("implement ParseLore")
        //parseLore(message.author.username,cleanArr[i]);
    }
    loreArr = null;   //freeup for gc()
    cleanArr = null;  //freeup for gc()
  }
  else if (message.content.trim().indexOf(" is using:") >0
      //  && message.author.username.substring(0,botname.length).toLowerCase() !== botname)
          && message.author.id != process.env.DISCORD_OWNERID)
  {
    let lookArr = null, cleanArr = [], charName = null;
    lookArr = message.content.trim().split(/([A-Z][a-z]+) is using:/);
    for (let i = 0; i < lookArr.length; i++) {
      if  (/^([A-Z][a-z]+)$/.test(lookArr[i].trim())) {
        charName = lookArr[i].trim();
      }
      else if (lookArr[i].trim().indexOf("<") === 0 && charName != null && charName.length > 0)
      {
        cleanArr.push(`${charName} is using:\n${lookArr[i].trim()}`);
        charName = null;
      }
      else {
        charName = null;
      }
    }
    for (let i = 0; i < cleanArr.length; i++){
      //console.log(`cleanArr[${i}]: ${cleanArr[i]}`);
      console.log("implement ParseEqLook")
      //ParseEqLook(message.author.username,cleanArr[i]);
    }


    cleanArr = null;
    lookArr = null;
  }   //end if  
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

client.login(process.env.DISCORD_TOKEN)  // make sure the .env is setup
client.on(Events.ClientReady, () => {
  console.log('The bot is ready')
})
