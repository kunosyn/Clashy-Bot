import * as discord from 'discord.js'
import * as coc from 'clashofclans.js'
import { ExtendedClient } from '../classes'
import { CLAN_TAG, LEAGUE_COLORS, ROLE_NAMES } from '../globals'
import { getLeagueColor } from '../utility'

type GivenUser = discord.GuildMember | string | undefined | null

export const builder = new discord.SlashCommandBuilder()
    .setName('user')
    .setDescription('Fetches clash of clans user info with their tag!')
    .addStringOption(
        new discord.SlashCommandStringOption()
            .setName('tag')
            .setDescription('User\'s clash of clans tag.')
    )
    .addUserOption(
        new discord.SlashCommandUserOption()
            .setName('discord_user')
            .setDescription('The clan member whos details you are trying to fetch.')
    )

export const execute = async ( client: ExtendedClient, clashClient: coc.Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => {
    let userGiven: GivenUser = interaction.options.getString('tag') ?? (interaction.options.getMember('discord_user') as discord.GuildMember | null)
    userGiven ??= interaction.guild?.members.cache.find(member => member.id == interaction.user.id) ?? await interaction.guild?.members.fetch(interaction.user.id)
    
    let clanInfo = await clashClient.getClan(CLAN_TAG), clanMembers: coc.ClanMember[] = clanInfo.members
    let userInfo: coc.Player | null = null, embed: discord.EmbedBuilder | null = null

    if (typeof userGiven == 'string') {
        try {
            userInfo = await clashClient.getPlayer(userGiven)
        } catch (e) {
            await interaction.editReply({ content: `Player with tag ${userGiven} does not exist!` })
            return
        }
    } else if (userGiven instanceof discord.GuildMember) {
        let clanMember = clanMembers.find(m => m.name == (userGiven as discord.GuildMember).nickname ?? (userGiven as discord.GuildMember).user.username)

        if (!clanMember) {
            embed = new discord.EmbedBuilder({
                title: 'Not Verified ',
                description: interaction.user.id == userGiven.user.id ? 'You are not verified! Please run \`/verify\` or specify your user tag to view your info!' : `\`${userGiven.user.username}\` is not verified! They must verify or you should specify their user tag to view their info!`,
                color: 0xff636b,
                footer: {
                    text: 'clashy',
                    icon_url: client.user!.avatarURL() as string
                }
            })

            embed.setTimestamp()
            embed.setThumbnail(interaction.user.avatarURL() ?? client.user!.avatarURL())

            await interaction.editReply({ embeds: [ embed ] })
            return
        }

        userInfo = await clanMember.fetch()
    }

    if (userInfo !== null) {
        userInfo = userInfo as coc.Player

        let clanTag = (userInfo.clan != null && userInfo.clan != undefined) ? `(${userInfo.clan.tag})` : ''

        embed = new discord.EmbedBuilder({
            title: `**${userInfo.name} (${userInfo.tag})**`,

            url: userInfo.shareLink,
            
            thumbnail: userInfo.league.icon,

            color: getLeagueColor(userInfo.league.name),

            footer: {
                text: 'clashy',
                icon_url: client.user!.avatarURL() as string
            },

            fields: [
                { name: 'Clan', value: `${(userInfo.clan ?? { name: 'none' }).name} ${clanTag}`, inline: true },
                { name: 'League', value: `${userInfo.league.name}`, inline: true },
                { name: 'Attack Wins', value: userInfo.attackWins.toString(), inline: true },
                { name: 'Defense Wins', value: userInfo.defenseWins.toString(), inline: true },
                { name: 'Experience', value: userInfo.expLevel.toString(), inline: true },
                { name: 'Donations', value: userInfo.donations.toString(), inline: true },
                { name: 'Recieved', value: userInfo.received.toString(), inline: true },
                { name: 'Role', value: ROLE_NAMES[userInfo.role ?? 'clanless'], inline: true },
                { name: 'Trophies', value: userInfo.trophies.toString(), inline: true },
                { name: 'War Preference', value: userInfo.warStars.toString(), inline: true },
                { name: 'War Status', value: userInfo.warOptedIn ? 'In' : 'Out', inline: true },
                { name: 'Town Hall', value: `Level ${userInfo.townHallLevel}`, inline: true },
                { name: 'Builder Hall', value: `Level ${userInfo.builderHallLevel}`, inline: true },
                { name: 'Barbarian King', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Barbarian King')[0]?.level || 0}`, inline: true },
                { name: 'Archer Queen', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Archer Queen')[0]?.level || 0}`, inline: true },
                { name: 'Grand Warden', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Grand Warden')[0]?.level || 0}`, inline: true },
                { name: 'Royal Champion', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Royal Champion')[0]?.level || 0}`, inline: true },
                { name: 'Battle Machine', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Battle Machine')[0]?.level || 0}`, inline: true },
            ]
        })

        embed.setTimestamp()
        await interaction.editReply({ embeds: [ embed ] })
    }
}