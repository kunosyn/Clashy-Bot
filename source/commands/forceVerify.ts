import * as discord from 'discord.js'
import * as coc from 'clashofclans.js'
import { ExtendedClient } from '../classes'
import { CLAN_TAG, LEAGUE_COLORS, ROLE_NAMES, VERIFICATION_CHANNEL } from '../globals'

export const builder = new discord.SlashCommandBuilder()
    .setName('forceverify')
    .setDescription('Forces someone to be verified to a clash of clans user.')
    .addStringOption(
        new discord.SlashCommandStringOption()
            .setName('username')
            .setDescription('Clash of clans username to force.')
            .setRequired(true)
    )
    .addUserOption(
        new discord.SlashCommandUserOption()
            .setName('user')
            .setDescription('The user to force the verification on.')
            .setRequired(true)
    )

export const execute = async ( client: ExtendedClient, clashClient: coc.Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => {
    let channel = await client.channels.fetch(VERIFICATION_CHANNEL)
    if (!channel || !channel.isTextBased()) throw new Error('Channel is not able to be fetched.')

    let givenUsername = interaction.options.getString('username', true), givenMember = (interaction.options.getMember('user') as discord.GuildMember)
    let member = interaction.guild!.members.cache.find(m => m.id == interaction.user.id) ?? await interaction.guild!.members.fetch(interaction.user.id)
    let clanMembers = await clashClient.getClanMembers(CLAN_TAG)

    let embed: discord.EmbedBuilder
    
    if (member.roles.cache.find(r => r.name == 'Co-Leader') || member.roles.cache.find(r => r.name == 'Leader')) {
        embed = new discord.EmbedBuilder({
            title: 'Force Verification Success',
            description: `Successfully force verified \`${givenMember.user.username}\`!`,
            fields: [
                { name: 'Requested Clash of Clans Username', value: givenUsername, inline: true },
                { name: 'Requested User', value: givenMember.user.username, inline: true },
                { name: 'Forced By', value: interaction.user.username, inline: true }
            ],
            color: 0x63ff8d,
            footer: {
                icon_url: (client.user!.avatarURL() as string),
                text: client.user!.username
            }
        })

        embed.setTimestamp()
        embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())

        await channel.send({ embeds: [ embed ] })
        await givenMember.setNickname(givenUsername)
    } else {
        embed = new discord.EmbedBuilder({
            title: 'Force Verification Cancelled',
            description: 'You do not have the permissions to force verification!\nTo force verification you must either be a \`Co-Leader\` or \`Leader\`!',
            fields: [
                { name: 'Requested Clash of Clans Username', value: givenUsername, inline: true },
                { name: 'Requested User', value: givenMember.user.username, inline: true }
            ],
            color: 0xff636b,
            footer: {
                icon_url: (client.user!.avatarURL() as string),
                text: client.user!.username
            }
        })

        embed.setTimestamp()
        embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())
    }

    await interaction.editReply({ embeds: [ embed ] })
}