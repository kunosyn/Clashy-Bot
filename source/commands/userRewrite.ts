import * as discord from 'discord.js'
import * as coc from 'clashofclans.js'
import { ExtendedClient } from '../classes'
import { CLAN_TAG, LEAGUE_COLORS, ROLE_NAMES } from '../globals'

type GivenUser = discord.User | discord.GuildMember | string | undefined | null

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
    let userGiven: GivenUser = interaction.options.getString('tag') ?? interaction.options.getUser('discord_user')
    userGiven ??= interaction.guild?.members.cache.find(member => member.id == interaction.user.id)

    var userInfo: coc.Player | null 
    let clanInfo = await clashClient.getClan(CLAN_TAG)
    let clanMembers: coc.ClanMember[] = clanInfo.members

    if (typeof userGiven == 'string') {

    } else if (userGiven instanceof discord.User) {
        userGiven = interaction.guild?.members.cache.find(m => m.id == userGiven.id)
    }


    if (discordUser != null) {
        try {
            

            //@ts-ignore
            let userNickname = discordUser.nickname ?? user!.username
            let foundMember: coc.ClanMember = clanMembers.filter(member => member.name == userNickname)[0]
      

            if (foundMember != null) {
                userTag = foundMember.tag
            } else {
                return await interaction.editReply('User does not have a valid nickname!')
            }
        } catch (e) {
            return await interaction.editReply('User does not have a valid nickname!')
        }
    }

    try {
        var userInfo = await clashClient.getPlayer(userTag as string)
    } catch (error) {
        return await interaction.editReply(`User does not exist with tag ${userTag}!`)
    }

    let color = 0xffffff;
    
    
    


    let embed = new discord.EmbedBuilder({
        title: `**${userInfo.name} (${userTag})**`,

        url: userInfo.shareLink,
        
        thumbnail: userInfo.league.icon,

        color: color,

        footer: {
            text: 'clashy',
            icon_url: client.user!.avatarURL() as string
        },

        fields: [
            { name: 'Clan', value: `${(userInfo.clan ?? { name: 'none' }).name}`, inline: true },
            { name: 'League', value: `${userInfo.league.name}`, inline: true },
            { name: 'Attack Wins', value: userInfo.attackWins.toString(), inline: true },
            { name: 'Defense Wins', value: userInfo.defenseWins.toString(), inline: true },
            { name: 'Experience', value: userInfo.expLevel.toString(), inline: true },
            { name: 'Donations', value: userInfo.donations.toString(), inline: true },
            { name: 'Recieved', value: userInfo.received.toString(), inline: true }, // @ts-ignore
            { name: 'Role', value: (ROLE_NAMES[userInfo.role] || 'Clanless'), inline: true },
            { name: 'Trophies', value: userInfo.trophies, inline: true },
            { name: 'War Prefere', value: userInfo.warStars, inline: true },
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