const {RichEmbed, ReactionCollector} = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

function embedPage(pages, message) {
    let page = message.page;
    const embed = new RichEmbed()
    .setTitle(`Page ${page} of filters`)
    .setColor(config.blue);
    let currentPage, channel;
    for (let i = 1; i <= 15; i++) {
        currentPage = pages[(15 * (page - 1)) + i];
        if (!currentPage) break;
        channel = message.guild.channels.find(c => c.id === currentPage.channel);
        embed.addField(currentPage.id,
         `Regex: \`${currentPage.regex.replace(/`/g, "\`")}\`\nChannel: ${channel ? `<#${channel.id}>` : "Deleted Channel"}\nPunishment: ${currentPage.action.toProperCase()}`)
    };
    if (embed.fields.length === 0) embed.setDescription("No Regexes on this page")
    return embed;
};

exports.run = async (client, message, args) => {
    if (await client.helpArgs(client, message, args, exports)) return;
    if (!message.member.hasPermission(exports.conf.permission)) return errors.noPermissions(message, exports);
    const allfilters = client.db.r.table("filters");
    const channel = args[0] ? message.guild.channels.find(c => c.id == args[0].replace(/[^0-9]/g, "") || c.name == args.join(" ")) : undefined;

    if (channel) {
        const filters = allfilters.filter(f => f.channel == channel.id && f.guild == message.guild.id);
        if (!filters) {
            if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
                const embed = new RichEmbed()
                .setTitle("No Filters")
                .setDescription(`<#${channel.id}> has no filters set`)
                .setColor(config.blue)
                .setTimestamp()

                return await message.channel.send(embed)
                .catch(err => {});
            } else {
                return await message.channel.send(`<#${channel.id}> has no filters set`)
                .catch(err => {});
            };
        };
        } else {
            const filters = allfilters.filter(c => c.guild == message.guild.id);
            if (!filters) {
                if (message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
                    const embed = new RichEmbed()
                    .setTitle("No Filters")
                    .setDescription(`${guild.name} has no filters set`)
                    .setColor(config.blue)
                    .setTimestamp()

                    return await message.channel.send(embed)
                    .catch(err => {});
                } else {
                    return await message.channel.send(`${guild.name} has no filters set`)
                    .catch(err => {});
                
                };
            };
        };
    
    const requiredPermissions = [
        "ADD_REACTIONS",
        "MANAGE_MESSAGES",
        "EMBED_LINKS"
    ];
    message.page = 1
    for (const permission in requiredPermissions) {
        
        if (permission === "random") continue;
        if (!message.channel.permissionsFor(message.guild.me).has(requiredPermissions[permission])) {
            return await message.channel.send(`I am missing the required \`${requiredPermissions[permission]}\` permission to use this command`)
            .catch(err => {})
            .then(msg => msg.delete(10000).catch(err => {}));
        };
    };
    let embedPages = [0]; // Any new items will start at index 1
    if (channel) filtered = await client.db.r.table("filters").run().filter(c => c.channel === channel.id && c.guild === message.guild.id); 
    if (!channel) filtered = await client.db.r.table("filters").run().filter(c => c.guild === message.guild.id);
    filtered.forEach(filter => embedPages.push(filter));
    
    const msg = await message.channel.send("Loading...");
    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");
    const emojis = ["⬅", "➡"]
    const filter = (reaction, user) => user.id === message.author.id;
    const collector = await new ReactionCollector(msg, filter);
    await msg.edit(embedPage(embedPages, message))
    collector.on("collect", async reaction => {
        await reaction.remove(reaction.users.last());
        if (reaction.emoji.name == "❌") return collector.stop();
        if (emojis.includes(reaction.emoji.name)) {
            message.page = reaction.emoji.name == "➡" ? message.page + 1 : message.page - 1;
            if (message.page < 1) message.page = 1;
            await msg.edit(embedPage(embedPages, message));
        };
    });

    collector.on("end", async (collected, reason) => {
        await msg.delete();
    });
};


exports.help = {
    name: "listfilters",
    category: "Administration",
    description: "Lists filters, if no channel is specified, it will list filters for the whole server",
    usage: "listfilters [channel]"
};

exports.conf = {
    permission: "MANAGE_CHANNELS"
}