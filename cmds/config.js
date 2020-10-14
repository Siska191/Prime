const fs = require('fs')

module.exports = async (message, args, i) => {
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('No permissions')
    let items = '\`welcomeChannel\`, \`goodbyeChannel\`, \`welcomeMessage\`, \`goodbyeMessage\`, \`prefix\`, \`mutedRole\`'
    let cmd = args[0]
    if(!cmd) return message.channel.send(`Invalid Item Choose from: ${items}`)
    if(cmd == 'prefix') {
        let newPrefix = args[1]
        if(!newPrefix) return message.channel.send('Provide a prefix please!')
        message.channel.send(`Set the new prefix to ` + newPrefix)
        i.prefix = newPrefix
        console.log(i)
        return fs.writeFileSync(`guilds/${message.guild.id}.json`, JSON.stringify(i, null, '\t'))
    }
    if(cmd == 'welcomeChannel') {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
        if(!channel) return message.channel.send('Invalid Channel')
        i.welcomeChannelID = channel.id
        fs.writeFileSync(`guilds/${message.guild.id}.json`, JSON.stringify(i, null, '\t'))
        return message.channel.send(`Set the new channel to ${channel.toString()}`)
    }
    if(cmd == 'mutedRole') {
        let r = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        if(!r) return message.channel.send('Supply a role!')
        i.mutedRole = r.id
        fs.writeFileSync(`guilds/${message.guild.id}.json`, JSON.stringify(i, null, '\t'))
        return message.channel.send(`Updated value \`${cmd}\` to input role ${r.toString()}`)
    }
    if(cmd == 'goodbyeChannel') {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get()
        if(!channel) return message.channel.send('Invalid Channel')
        i.goodbyeChannelID = channel.id
        fs.writeFileSync(`guilds/${message.guild.id}.json`, JSON.stringify(i, null, '\t'))
        return message.channel.send(`Set the new channel to ${channel.toString()}`)
    }

    if(cmd == 'welcomeMessage') {
        //
    }
    if(cmd == 'goodbyeMessage') {
        let message = args[1]
        if(!message) return message.channel.send('Supply a message')
    }

}


