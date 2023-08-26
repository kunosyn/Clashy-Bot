import * as discord from 'discord.js'
import { ExtendedClient } from './classes'
import { Client } from 'clashofclans.js'

import { CommandFile } from './types'
import { API_CREDENTIALS, DISCORD_TOKEN, VERIFICATION_CHANNEL, MEMBER_ROLE } from './globals'

import fs from 'node:fs'

const clashClient = new Client()
const discordClient = new ExtendedClient({
    intents: [ discord.GatewayIntentBits.GuildMembers, discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.MessageContent ]
})

var verificationChannel: discord.Channel | undefined
var memberRole: discord.Role | null | undefined

discordClient.once('ready', async () => {
    await clashClient.login({ email: API_CREDENTIALS.email, password: API_CREDENTIALS.password })
    console.log(`Logged in as ${discordClient.user!.username}!`)

    let commandFiles = fs.readdirSync(__dirname + '/commands')

    for (let commandFile of commandFiles) {
        const command: CommandFile = await import(`./commands/${commandFile}`)
        discordClient.commands.set(command.builder.name, command.execute)
    }

    verificationChannel = discordClient.channels.cache.get(VERIFICATION_CHANNEL)
})

discordClient.on('interactionCreate', async ( interaction: discord.Interaction ) => {
    memberRole ??= await interaction.guild?.roles.fetch(MEMBER_ROLE)

    if (interaction.isChatInputCommand()) {
        if (!interaction.inCachedGuild()) {
            await interaction.reply('Guild is not cached.')
            return
        }

        if (discordClient.commands.has(interaction.commandName)) {
            try {
                let msg = await interaction.deferReply()
       
                let execute: CommandFile['execute'] = discordClient.commands.get(interaction.commandName)

                await execute(discordClient, clashClient, interaction, parseInt(msg.id))
            } catch (error: any | Error) {
                await interaction.editReply('Error.') // Interactions when deferred must be given content before you can delete them.
                await interaction.deleteReply()

                await interaction.followUp({ content: `Error: \n\`\`\`${error}\`\`\``, ephemeral: true })
            }
        } else {
            await interaction.reply({ content: 'Error: Command file has not been properly setup.', ephemeral: true })
        }
    } else if (interaction.isButton()) {
        if (!interaction.inCachedGuild()) {
            await interaction.reply('Guild is not cached.')
            return
        }

        let args = interaction.customId.split('_')

        if (args[0].endsWith('Verify'))  {
            let embed = new discord.EmbedBuilder().setTitle('Verification Result')

            switch (args[0]) {
                case 'acceptVerify':
                    embed.setColor(0x63ff8d)
                    embed.addFields(
                        { name: 'Verified User', value: discordClient.users.cache.get(args[1])?.username ?? args[1], inline: true },
                        { name: 'Clash of Clans User', value: args[2], inline: true },
                        { name: 'Accepted By', value: interaction.user.username, inline: true }
                    )
                    embed.setThumbnail(interaction.user.avatarURL())
                break;

                case 'denyVerify':
                    embed.setColor(0xff636b)
                    embed.addFields(
                        { name: 'Denied User', value: args[1], inline: true },
                        { name: 'Clash of Clans User', value: args[3], inline: true },
                        { name: 'Denied By', value: interaction.user.username, inline: true }
                    )
                    embed.setThumbnail(interaction.user.avatarURL())
                break;
            }

            let user = interaction.guild!.members.cache.find(member => member.id == args[1])

            if (user?.nickname == args[2]) {
                await interaction.reply('User is already verified to this name!')
                return
            }

            if (!(user?.roles.cache.find(r => r.name == 'Member')) && memberRole) {
                user?.roles.add(memberRole)
            }

            await interaction.reply({ embeds: [ embed ], components: [ ] })
            user?.setNickname(args[2])
        }
    }
})


discordClient.login(DISCORD_TOKEN)