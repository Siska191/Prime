const { MessageEmbed } = require('discord.js')

module.exports = async (message, args, i) => {
    let premium = i.pre
    let msg
    if(premium == true) msg = "Enabled (This Guild Only)"
    if(premium == false) msg = "Disabled"
    let ch = i.welcomeChannelID
    let ch2 = i.goodbyeChannelID
    if(!ch == "None") ch = message.guild.channels.cache.find(c => c.name == i.welcomeChannelID)
    if(!ch2 == 'None') ch2 = message.guild.channel.cache.find(c => c.name == i.goodbyeChannelID)
    if(!ch) ch = "None"
    if(!ch2) ch2 = "None"
    let embed = new MessageEmbed()
    .setTitle('Help')
    .setDescription(`
    Prefix: ${i.prefix}
    Premium: ${msg}
    Welcome Channel: <#${ch}>
    Leave Channel: <#${ch2}>
    Custom Join Message: ${i.welcomeMessage}
    Custom Goodbye Message: ${i.goodbyeMessage}
    Muted Role: ${i.mutedRole}
    `)
    .addField('Server Config', 'config [cmd]')
    .addField('Temp Mute', 'tempmute <user> <time> [reason]')
    .addField('Member Warn', 'warn <user> [reason]')
    .addField('Punishment Records', 'records [user]')
    message.channel.send(embed)
}