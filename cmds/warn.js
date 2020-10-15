const { MessageEmbed } = require('discord.js')
const fs = require('fs')
function getId() {
    let value = Math.random()
    return value;
}

module.exports = async (message, args, i) => {
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('No permissions!')
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
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!user) return message.channel.send('Supply a user!')
    let reason = args.slice(1).join(' ')
    if(!reason) reason = "None"
    let defualtSyntax = {
        "id":punishmentId,
        "reason":reason,
        "author":message.author.id,
        "user":user.user.id,
        "type":"warn"
    }
    let embed = new MessageEmbed()
    .setTitle('Warned ' + user.user.tag)
    .setDescription(`
    Punishment ID: ${punishmentId}
    Reason: ${reason}
    `)
    user.user.send(embed)
    message.channel.send(embed)
    fs.writeFileSync(`punishments/${message.guild.id}-${user.user.id}-${fileId}.json`, JSON.stringify(defualtSyntax, null, "\t"))
}

