import * as discord from 'discord.js'
import * as coc from 'clashofclans.js'
import { ExtendedClient } from '../classes'
import { CLAN_TAG, LEAGUE_COLORS, ROLE_NAMES, VERIFICATION_CHANNEL } from '../globals'

export const builder = new discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verfiys you with your Clash of Clans account!')
    .addStringOption(
        new discord.SlashCommandStringOption()
            .setName('username')
            .setDescription('Username of account you\'re trying to verify with.')
            .setRequired(true)
    )

export const execute = async ( client: ExtendedClient, clashClient: coc.Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => {
    let channel = await client.channels.fetch(VERIFICATION_CHANNEL)
    if (!channel || !channel.isTextBased()) throw new Error('Channel is not able to be fetched.')

    let givenUsername = interaction.options.getString('username', true)
    let member = interaction.guild!.members.cache.find(m => m.id == interaction.user.id) ?? await interaction.guild!.members.fetch(interaction.user.id)
    let clanMembers = await clashClient.getClanMembers(CLAN_TAG)

    let existingWithNickname = interaction.guild!.members.cache.find(m => m.nickname == givenUsername) ?? (await interaction.guild!.members.fetch()).filter(f => f.nickname == givenUsername).at(0)

    let embed: discord.EmbedBuilder

    if (existingWithNickname) {
        embed = new discord.EmbedBuilder({
            title: 'Verification Cancelled',
            description: `User \`${existingWithNickname.user.username}\` is already verified to \`${givenUsername}\`!`,
            color: 0xff636b,
            fields: [
                { name: 'Discord User', value: interaction.user.username, inline: true },
                { name: 'Reqested Clash of Clans User', value: givenUsername, inline: true }
            ],
            footer: {
                text: 'clashy',
                icon_url: client.user!.avatarURL() as string
            },
        })

        embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
        embed.setTimestamp()

        await interaction.editReply({ embeds: [ embed ] })
        return
    }

    if (clanMembers.find(m => m.name == givenUsername) == undefined) {
        embed = new discord.EmbedBuilder({
            title: 'Verification Cancelled',
            description: `There is no user with username \`${givenUsername}\` in the clan!`,
            color: 0xff636b,
            fields: [
                { name: 'Discord User', value: interaction.user.username, inline: true },
                { name: 'Reqested Clash of Clans User', value: givenUsername, inline: true }
            ],
            footer: {
                text: 'clashy',
                icon_url: client.user!.avatarURL() as string
            },
        })

        embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
        embed.setTimestamp()

        await interaction.editReply({ embeds: [ embed ] })
        return
    }


    if (givenUsername == member.nickname) {
        embed = new discord.EmbedBuilder({
            title: 'Verification Cancelled',
            description: 'You are already verified to this name!',
            color: 0xff636b,
            fields: [
                { name: 'Discord User', value: interaction.user.username, inline: true },
                { name: 'Reqested Clash of Clans User', value: givenUsername, inline: true }
            ],
            footer: {
                text: 'clashy',
                icon_url: client.user!.avatarURL() as string
            },
        })

        embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
        embed.setTimestamp()

        await interaction.editReply({ embeds: [ embed ] })
        return
    }

    embed = new discord.EmbedBuilder({
        title: `Verification Request`,
        color: 0xffffff,
        description: 'Your verification request has been sent!',
        fields: [
            { name: 'Discord User', value: interaction.user.username, inline: true },
            { name: 'Requested Clash of Clans User', value: givenUsername, inline: true }
        ],
        footer: {
            text: 'clashy',
            icon_url: client.user!.avatarURL() as string
        },
    })

    embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
    embed.setTimestamp()

    let acceptButton = new discord.ButtonBuilder({
        label: 'Accept',
        style: discord.ButtonStyle.Success,
        emoji: '✅',
        customId: `acceptVerify_${interaction.user.id}_${givenUsername}_${interaction.id}`
    })

    let denyButton = new discord.ButtonBuilder({
        label: 'Deny',
        style: discord.ButtonStyle.Danger,
        emoji: '❎',
        customId: `denyVerify_${interaction.user.id}_${givenUsername}_${interaction.id}`
    })

    let row = new discord.ActionRowBuilder<discord.ButtonBuilder>({
        components: [ acceptButton, denyButton ]
    })

    await interaction.editReply({ embeds: [ embed ]})


    embed = new discord.EmbedBuilder({
        title: `Verification Request`,
        color: 0xffffff,
        fields: [
            { name: 'Discord User', value: interaction.user.username, inline: true },
            { name: 'Requested Clash of Clans User', value: givenUsername, inline: true }
        ],
        footer: {
            text: 'clashy',
            icon_url: client.user!.avatarURL() as string
        },
    })
    
    embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
    embed.setTimestamp()
    
    await channel.send({ embeds: [ embed ], components: [ row ] })
}