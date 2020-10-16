const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = async (message, args, i) => {
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('No permissions!')
    if(args[0] == "delete") {
        let i = args[1]
        if(!i) return message.channel.send('Supply the punishment id!')
        fs.readdir('punishments', (err, files) => {
            if(err)
                return console.log(err)
            files.forEach(file => {
                let f = require(`../punishments/${file}`)
                if(!f.id == i || !file.includes(`${message.guild.id}`)) return message.channel.send('Could not match a file with that id in your guild!')
                if(f.id == i) { fs.unlinkSync(`punishments/${file}`); message.channel.send('Deleted punishment from dictionary!') }
            })
        })
        return;
    }
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!user) return message.channel.send('Supply a user! (Use \`delete\` argument instead of user to delete a punishment!)')
    let embed = new MessageEmbed()
    .setTitle('Found records')
    .setFooter('Don\'t see any? There\'s none found than!')

    fs.readdir('punishments', (err, files) => {
        if(err)
            return console.log(err)
        files.forEach(file => {
            if(file.includes(user.user.id) && file.includes(message.guild.id)) {
                let req = require(`../punishments/${file}`)
                embed.addField(`User Punished ID: ${req.user} Moderator ID: ${req.author} Reason: \`${req.reason}\` Type: \`${req.type}\``, `Punishment ID: \`${req.id}\``)
            }
    })
    message.channel.send(embed)
})}