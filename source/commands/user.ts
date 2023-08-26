// import * as discord from 'discord.js'
// import * as coc from 'clashofclans.js'
// import { ExtendedClient } from '../classes'
// import { CLAN_TAG, LEAGUE_COLORS, ROLE_NAMES } from '../globals'

// export const builder = new discord.SlashCommandBuilder()
//     .setName('user')
//     .setDescription('Fetches clash of clans user info with their tag!')
//     .addStringOption(
//         new discord.SlashCommandStringOption()
//             .setName('tag')
//             .setDescription('User\'s clash of clans tag.')
//     )
//     .addUserOption(
//         new discord.SlashCommandUserOption()
//             .setName('discord_user')
//             .setDescription('The clan member whos details you are trying to fetch.')
//     )

// export const execute = async ( client: ExtendedClient, clashClient: coc.Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => {
//     let userTag = interaction.options.getString('tag')
//     let user = interaction.options.getUser('discord_user')

//     if (user != null) {
//         if (user.bot) return await interaction.editReply('Cannot use this command on bots!');

//         var discordUser = await interaction.guild?.members.cache.find(member => member.id == user!.id)
//     } else if (user == null && userTag == null) {
//         var discordUser = await interaction.guild?.members.cache.find(member => member.id == interaction.user.id)
//     }

//     if (userTag != null) {
//         if (userTag.charAt(0) != '#') {
//             userTag = `#${userTag}`
//         }
//     } else if (discordUser != null) {
//         try {
//             let clanInfo = await clashClient.getClan(CLAN_TAG)
//             let clanMembers: coc.ClanMember[] = clanInfo.members

//             //@ts-ignore
//             let userNickname = discordUser.nickname ?? user!.username
//             let foundMember: coc.ClanMember = clanMembers.filter(member => member.name == userNickname)[0]
      

//             if (foundMember != null) {
//                 userTag = foundMember.tag
//             } else {
//                 return await interaction.editReply('User does not have a valid nickname!')
//             }
//         } catch (e) {
//             return await interaction.editReply('User does not have a valid nickname!')
//         }
//     }

//     try {
//         var userInfo = await clashClient.getPlayer(userTag as string)
//     } catch (error) {
//         return await interaction.editReply(`User does not exist with tag ${userTag}!`)
//     }

//     let color = 0xffffff;
    
//     if (userInfo.league.name.startsWith('Legend'))
//         color = LEAGUE_COLORS.Legend
//     else if (userInfo.league.name.startsWith('Titan'))
//         color = LEAGUE_COLORS.Titan
//     else if (userInfo.league.name.startsWith('Champion'))
//         color = LEAGUE_COLORS.Champion
//     else if (userInfo.league.name.startsWith('Master'))
//         color = LEAGUE_COLORS.Master
//     else if (userInfo.league.name.startsWith('Crystal'))
//         color = LEAGUE_COLORS.Crystal
//     else if (userInfo.league.name.startsWith('Gold'))
//         color = LEAGUE_COLORS.Gold
//     else if (userInfo.league.name.startsWith('Silver'))
//         color = LEAGUE_COLORS.Silver
//     else if (userInfo.league.name.startsWith('Bronze'))
//         color = LEAGUE_COLORS.Bronze
    


//     let embed = new discord.EmbedBuilder({
//         title: `**${userInfo.name} (${userTag})**`,

//         url: userInfo.shareLink,
        
//         thumbnail: userInfo.league.icon,

//         color: color,

//         footer: {
//             text: 'clashy',
//             icon_url: client.user!.avatarURL() as string
//         },

//         fields: [
//             { name: 'Clan', value: `${(userInfo.clan ?? { name: 'none' }).name}`, inline: true },
//             { name: 'League', value: `${userInfo.league.name}`, inline: true },
//             { name: 'Attack Wins', value: userInfo.attackWins.toString(), inline: true },
//             { name: 'Defense Wins', value: userInfo.defenseWins.toString(), inline: true },
//             { name: 'Experience', value: userInfo.expLevel.toString(), inline: true },
//             { name: 'Donations', value: userInfo.donations.toString(), inline: true },
//             { name: 'Recieved', value: userInfo.received.toString(), inline: true }, // @ts-ignore
//             { name: 'Role', value: (ROLE_NAMES[userInfo.role] || 'Clanless'), inline: true },
//             { name: 'Trophies', value: userInfo.trophies, inline: true },
//             { name: 'War Prefere', value: userInfo.warStars, inline: true },
//             { name: 'War Status', value: userInfo.warOptedIn ? 'In' : 'Out', inline: true },
//             { name: 'Town Hall', value: `Level ${userInfo.townHallLevel}`, inline: true },
//             { name: 'Builder Hall', value: `Level ${userInfo.builderHallLevel}`, inline: true },
//             { name: 'Barbarian King', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Barbarian King')[0]?.level || 0}`, inline: true },
//             { name: 'Archer Queen', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Archer Queen')[0]?.level || 0}`, inline: true },
//             { name: 'Grand Warden', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Grand Warden')[0]?.level || 0}`, inline: true },
//             { name: 'Royal Champion', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Royal Champion')[0]?.level || 0}`, inline: true },
//             { name: 'Battle Machine', value: `Level ${userInfo.heroes.filter(hero => hero.name == 'Battle Machine')[0]?.level || 0}`, inline: true },
//         ]
//     })

//     embed.setTimestamp()
//     await interaction.editReply({ embeds: [ embed ] })
// }