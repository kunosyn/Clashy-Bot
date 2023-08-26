import * as discord from 'discord.js'
import * as coc from 'clashofclans.js'
import { ExtendedClient } from '../classes'
import { CLAN_TAG } from '../globals'
import { getLeagueColor } from '../utility'

export const builder = new discord.SlashCommandBuilder()
    .setName('clan')
    .setDescription('Fetches clash of clans clan info with it\'s tag!')
    .addStringOption(
        new discord.SlashCommandStringOption()
            .setName('tag')
            .setDescription('Clan\'s clash of clans tag.')
    )

export const execute = async ( client: ExtendedClient, clashClient: coc.Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => {
    let clanTag = (interaction.options.getString('tag') ?? CLAN_TAG)
    clanTag.charAt(0) == '#' ? clanTag : `#${clanTag}`

    let clanInfo = await clashClient.getClan(clanTag)

    let embed = new discord.EmbedBuilder({
        title: `${clanInfo.name} (${clanInfo.tag})`,
        url: clanInfo.shareLink,
        thumbnail: clanInfo.badge,
        color: getLeagueColor(clanInfo.warLeague?.name),
    
        fields: [
            { name: 'Description', value: clanInfo.description },
            { name: 'Family Friendly', value: clanInfo.isFamilyFriendly ? 'Yes' : 'No', inline: true },
            { name: 'Location', value: clanInfo.location?.name ?? 'Not Specified', inline: true },
            { name: 'Member Count', value: clanInfo.memberCount.toString(), inline: true },
            { name: 'Clan Level', value: clanInfo.level.toString(), inline: true },
            { name: 'Capital Hall Level', value: clanInfo.clanCapital?.capitalHallLevel?.toString() ?? '0', inline: true },
            { name: 'Total Trophies', value: clanInfo.points.toString(), inline: true },
            { name: 'War League', value: (clanInfo.warLeague?.name ?? 'N/A'), inline: true },
            { name: 'War Wins', value: clanInfo.warWins.toString(), inline: true },
            { name: 'War Losses', value: (clanInfo.warLosses?.toString() ?? '0'), inline: true },
            { name: 'War Ties', value: (clanInfo.warTies?.toString() ?? '0'), inline: true },
            { name: 'Win Loss Ratio', value: `${(clanInfo.warWins / (clanInfo.warLosses ?? 0)).toPrecision(2).toString()}`, inline: true}
        ]
    })

    await interaction.editReply({ embeds: [ embed ]})
}