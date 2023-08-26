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

    let embed = new discord.EmbedBuilder({
        title: `Verification Request`,
        color: 0xffffff,
        fields: [
            { name: 'Discord User', value: interaction.user.username, inline: true },
            { name: 'Clash of Clans User', value: givenUsername, inline: true }
        ]
    })
    
    embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())

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

    let row = new discord.ActionRowBuilder({
        components: [ acceptButton, denyButton ]
    })

    await interaction.editReply('Verification request has been sent!')

    //@ts-ignore
    await channel.send({ embeds: [ embed ], components: [ row ] })
}