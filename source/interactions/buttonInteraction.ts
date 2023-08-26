import * as discord from 'discord.js'
import { ExtendedClient } from '../classes'
import { memberRole } from '../globals'

export const handleButtonInteraction = async ( discordClient: ExtendedClient, interaction: discord.ButtonInteraction ) => {
    // Button interaction custom ids are split up into arguments this allows us to read to prevent DB calls.
    // Ex: (action)_(optional values)_(interaction message id)

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

        let user = interaction.guild!.members.cache.find(member => member.id == args[1]) ?? await interaction.guild!.members.fetch(args[1])

        // If the user's nickname is set we can assume they were already verified.
        if (user?.nickname == args[2]) {
            await interaction.reply('User is already verified to this name!')
            return
        }

        // If the user doesnt have the member role give it to them.
        if (!(user?.roles.cache.find(r => r.name == 'Member')) && memberRole) {
            user?.roles.add(memberRole)
        }

        await interaction.reply({ embeds: [ embed ], components: [ ] })
        user?.setNickname(args[2])
    }
}