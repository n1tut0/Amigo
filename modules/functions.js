const Discord = require("discord.js");
const config = require("../config.json");
const errors = require("../utils/errors.js");
const yiff = require("yiff");

module.exports = (client) => {
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "Hide the token!");

    return text;
  };

  client.helpArgs = async (client, message, args, exports) => {
    if (args[0] === "help") {
      const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
      const embed = new Discord.RichEmbed()
        .setTitle(`Command Information - \`${exports.help.name.toProperCase()}\``)
        .setDescription(`${exports.help.description}`)
        .setColor(config.blue)
        .addField("Usage:", `${prefix}${exports.help.usage}`, true)
        .addField("Permission:", `${exports.conf.permission}`, true)
        .addField("Aliases: ", exports.help.aliases ? exports.help.aliases.join(" , ") : "None", true);
      return message.channel.send(embed);
    } else {
      return false;
    }
  };

  client.findLogs = async (client, message, modLogs) => {
    const prefix = await client.db.r.table("guilds").get(message.guild.id).getField("prefix").run();
    if (!modLogs || !message.guild.channels.find(c => c.name === modLogs)) {
      const embed = new Discord.RichEmbed()
        .setTitle("An error has occurred!")
        .setDescription(`No log channel found with the name \`${modLogs}\`.`)
        .setColor(config.red)
        .setFooter(`Use ${prefix}edit modlogs to change this.`);
      return message.channel.send(embed), false;
    } else {
      return true;
    }
  };

  client.findPunishment = async (message, punishment) => {
    if (!punishment) {
      const embed = new Discord.RichEmbed()
        .setTitle('An error has occurred!')
        .setDescription(`A punishment with the specified ID hasn't been found.`)
        .setColor(config.red)
        .setFooter(message.author.tag, message.author.avatarURL);
      return message.channel.send(embed), false;
    } else {
      return true;
    }
  };

  client.sendPunishment = async(message, type, user, reason, modLogs, id) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Amigo Logs")
        .setDescription(`**Action: ${type}**\nGuild name: ${message.guild.name}`)
        .setColor(config.orange)
        .setTimestamp()
        .addField("User:", `${user} (${user.id})`, true)
        .addField("Action by:", `${message.author} (${message.author.id})`, true)
        .addField("Reason:", reason, true)
        .setFooter(`ID: ${id}`);
    let modLogsChannel = message.guild.channels.find(c => c.name === modLogs);
    await modLogsChannel.send(embed)
      .catch(async () => {
        await errors.couldNotLog(message, modLogs);
      });
    await user.send(embed)
      .catch(async () => {
        await errors.couldNotDM(message);
      });
  };

  client.canceled = (message) => {
    const embed = new Discord.RichEmbed()
      .setTitle("🚫 Canceled")
      .setColor(config.red)
      .setFooter(message.author.tag, message.author.avatarURL);
    return message.channel.send(embed);
  };

  client.furryAction = async (message, prop, mentioned) => {
    if (prop === "boop") {
      await yiff.furrybot.sfw.boop().then(image => {
        const embed = new Discord.RichEmbed()
          .setTitle(`${message.author.username} booped ${mentioned.user.username}!`)
          .setColor(config.blue)
          .setImage(image);
        message.channel.send(embed);
      });
    } else if (prop === "cuddle") {
      await yiff.furrybot.sfw.cuddle().then(image => {
        const embed = new Discord.RichEmbed()
          .setTitle(`${message.author.username} cuddled ${mentioned.user.username}!`)
          .setColor(config.blue)
          .setImage(image);
        message.channel.send(embed);
      });
    } else if (prop === "hold") {
      await yiff.furrybot.sfw.hold().then(image => {
        const embed = new Discord.RichEmbed()
          .setTitle(`${message.author.username} held ${mentioned.user.username}!`)
          .setColor(config.blue)
          .setImage(image);
        message.channel.send(embed);
      });
    } else if (prop === "hug") {
        try {
            const male = await message.guild.roles.find(r => r.name.toLowerCase() === "male");
            const female = await message.guild.roles.find(r => r.name.toLowerCase() === "female");
            
            search = "hug+rating:s";
            if (message.member.roles.has(male.id) && mentioned.roles.has(male.id)) {
                search = "male/male+hug+rating:s";
            } else if (message.member.roles.has(male.id) && mentioned.roles.has(female.id)) {
                search = "male/female+hug+rating:s";
            } else if (message.member.roles.has(female.id) && mentioned.roles.has(female.id)) {
                search = "female/female+hug+rating:s";
            };
        } catch (e) {
            console.log(e);
        };
        
        await yiff.e621.noCubFilter(search).then(r => {
            const embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.username} hugged ${mentioned.user.username}!`)
                .setColor(config.blue)
                .setImage(r.image);
            message.channel.send(embed);
        });
    } else if (prop === "kiss") {
      await yiff.furrybot.sfw.kiss().then(image => {
        const embed = new Discord.RichEmbed()
          .setTitle(`${message.author.username} kissed ${mentioned.user.username}!`)
          .setColor(config.blue)
          .setImage(image);
        message.channel.send(embed);
      });
    } else if (prop === "lick") {
      await yiff.furrybot.sfw.lick().then(image => {
        const embed = new Discord.RichEmbed()
          .setTitle(`${message.author.username} licked ${mentioned.user.username}!`)
          .setColor(config.blue)
          .setImage(image);
        message.channel.send(embed);
      });
    };
  };

  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.log(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.log(`Unhandled rejection: ${err}`);
  });
};