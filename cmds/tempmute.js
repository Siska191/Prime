const ms = require('ms')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = async (message, args, i) => {
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`:x: No permissions!`)
    let mutedRole = message.guild.roles.cache.get(i.mutedRole) || message.guild.roles.cache.find(r => r.name.toLowerCase() == "muted")
    if(!mutedRole) return message.channel.send('It seems like you have not set up a muted role or have used config to set one up!')
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!user) return message.channel.send('Invalid User')
    if(user.user.bot || user.hasPermission('MANAGE_GUILD')) return message.channel.send('This user is staff!')
    let time = args[1]
    if(!time) return message.channel.send('Please supply a time!')
    let reason = args.slice(2).join(' ')
    if(!reason) reason = "None";
    let memberRoles = user.roles.cache
    message.channel.send(`Muted ${user.toString()} for **${reason}** this mute will expire in \`${time}\``)
    await user.roles.set([mutedRole.id])
    user.user.send(`You have been muted for **${time}** with the reason of **${reason}**`)
    let getId = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    let punishmentId = getId()
    let fileId = Math.floor(Math.random(1) * 5000)
    // Syntax = "<guildId>-<userId>"
    let defualtSyntax = {
        "id":punishmentId,
        "reason":reason,
        "author":message.author.id,
        "user":user.user.id,
        "type":"tempmute"
    }
    fs.writeFileSync(`punishments/${message.guild.id}-${user.user.id}-${fileId}.json`, JSON.stringify(defualtSyntax, null, "\t"))
    await delay(ms(time))
    message.channel.send(`${user.user.username} has been unmuted`)
    user.roles.set(memberRoles)
    return user.user.send('You have been unmuted!')
}