const Discord = require('discord.js')
const client = new Discord.Client()
const ms = require('ms')
const { MessageEmbed, Collection } = require('discord.js')
const mutes = new Collection()
const { prefix, token } = require('./config.json')
const info = require('./auth.json')
const fs = require('fs')
// Read the docs for further info! https://discord.js.org/#/docs/main/stable/general/welcome
client.login(token)

client.once('ready', ()=>{console.log('Bot ready'); client.user.setActivity('on the highest scales')})

client.on('message', async (message)=>{
    if(message.author.bot) return

    if(!message.guild) return

    const i = require(`./guilds/${message.guild.id}.json`)

    if(!message.content.startsWith(i.prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    let parse = fs.existsSync(`./cmds/${command}.js`)
    if(!parse) return
    let cmd = require(`./cmds/${command}.js`)
    try {
        cmd(message, args, i, mutes)
    } catch (err){
        return message.channel.send('There was an error executing the command: ' + err)
    }
    
    
})




// Set-up new guilds
client.on('guildCreate', async guild=>{
    let welcomeEmbed = new MessageEmbed()
        .setTitle('Thank you for adding me!')
        .setThumbnail(guild.iconURL({dynamic: true}))
        .setDescription(`
        Thank you for adding me!

        To get started do \`${prefix}help\`!

        `)
    const defaultJSON = `
{
    "prefix":"${prefix}",
    "pre":false,
    "onModUserSend":false,
    "welcomeChannelID":"None",
    "goodbyeChannelID":"None",
    "goodbyeMessage":"Goodbye %TAG%!",
    "welcomeMessage":"Welcome %MENTION% to **%GUILD%**",
    "mutedRole":"None"
}
    `
    let ch = guild.channels.cache.filter(c => c.type == 'text').array()[0]
    if(ch) ch.send(welcomeEmbed).catch(err => console.log(err))
    fs.writeFileSync(`./guilds/${guild.id}.json`, defaultJSON, 'utf8')
    let i = require(`./guilds/${guild.id}.json`)
    let muteRole = await guild.roles.create({name: "Muted"})
    guild.channels.cache.forEach(c => {
        c.updateOverwrite(muteRole, {
            SEND_MESSAGES: false
        }).catch(err => console.log(err))
    })
})

// Update new channels
client.on('channelCreate', channel=>{
    if(!channel.guild) return
    let i = require(`./guilds/${channel.guild.id}.json`)
    let muteRole = channel.guild.roles.cache.find(r => r.name.toLowerCase() == "muted") || channel.guild.roles.cache.get(i.mutedRole)
    if(!muteRole) return
    channel.guild.channels.cache.forEach(c => {
        c.updateOverwrite(muteRole, {
            SEND_MESSAGES: false
        })
    })
})

// Remove Guild Settings
client.on('guildDelete', async (guild)=>{
    let id = guild.id
    fs.unlinkSync(`./guilds/${id}.json`)
})

client.on('guildMemberAdd', member=>{
    if(member.user.bot) return;
    let i = require(`./guilds/${member.guild.id}.json`)
    let welcomeMessage = i.welcomeMessage
    let ch = member.guild.channels.cache.get(i.welcomeChannelID)
    if(!ch) return
    let edit1 = welcomeMessage.replace('%GUILD%', member.guild.name)
    let edit2 = edit1.replace('%USERNAME%', member.user.username)
    let edit3 = edit2.replace('%TAG%', member.user.tag)
    let msg = edit3.replace('%MENTION%', member.toString())
    ch.send(msg)
    
})

client.on('guildMemberRemove', member=>{
    if(member.user.bot) return;
    let i = require(`./guilds/${member.guild.id}.json`)
    let goodbyeMessage = i.welcomeMessage
    let ch = member.guild.channels.cache.get(i.goodbyeChannelID)
    if(!ch) return
    let edit1 = goodbyeMessage.replace('%GUILD%', member.guild.name)
    let edit2 = edit1.replace('%USERNAME%', member.user.username)
    let edit3 = edit2.replace('%TAG%', member.user.tag)
    let msg = edit3.replace('%MENTION%', member.toString())
    ch.send(msg)
    
})
