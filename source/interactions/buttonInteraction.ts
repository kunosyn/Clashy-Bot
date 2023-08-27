import * as discord from 'discord.js'
import { ExtendedClient } from '../classes'
import { memberRole } from '../globals'

export const handleButtonInteraction = async ( discordClient: ExtendedClient, interaction: discord.ButtonInteraction ) => {
    // Button interaction custom ids are split up into arguments this allows us to read to prevent DB calls.
    // Ex: (action)_(optional values)_(interaction message id)

    let args = interaction.customId.split('_')
    
    if (args[0].endsWith('Verify'))  {
        let embed = new discord.EmbedBuilder().setTitle('Verification Result')
        let member = interaction.guild!.members.cache.find(member => member.id == args[1]) ?? await interaction.guild!.members.fetch(args[1])

        switch (args[0]) {
            case 'acceptVerify':
                embed.setColor(0x63ff8d)
                embed.setDescription('Verification request accepted.')
                embed.addFields(
                    { name: 'Verified User', value: member.user.username, inline: true },
                    { name: 'Requested Clash of Clans User', value: args[2], inline: true },
                    { name: 'Accepted By', value: interaction.user.username, inline: true }
                )
                embed.setFooter({ iconURL: (discordClient.user!.avatarURL() as string), text: discordClient.user!.username })
                embed.setTimestamp()
                embed.setThumbnail(interaction.user.avatarURL())
            break;

            case 'denyVerify':
                embed.setColor(0xff636b)
                embed.setDescription('Verification request denied.')
                embed.addFields(
                    { name: 'Denied User', value: member.user.username, inline: true },
                    { name: 'Request Clash of Clans User', value: args[2], inline: true },
                    { name: 'Denied By', value: interaction.user.username, inline: true }
                )
                embed.setFooter({ iconURL: (discordClient.user!.avatarURL() as string), text: discordClient.user!.username })
                embed.setTimestamp()
                embed.setThumbnail(interaction.user.avatarURL())
            break;
        }


        // If the user's nickname is set we can assume they were already verified.
        if (member?.nickname == args[2]) {
            await interaction.reply('User is already verified to this name!')
            return
        }

        await interaction.message.delete()
        await interaction.channel!.send({ embeds: [ embed ], components: [ ] })
        
        let dm = await member.user.createDM()
        await dm?.send({ embeds: [ embed ] })

        if (args[0] == 'acceptVerify') {
            // If the user doesnt have the member role give it to them.
            if (!(member?.roles.cache.find(r => r.name == 'Member')) && memberRole) {
                member?.roles.add(memberRole)
            }

            member?.setNickname(args[2])
        }
    }
}