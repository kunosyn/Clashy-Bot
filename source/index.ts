import * as discord from 'discord.js'
import { ExtendedClient } from './classes'
import { Client } from 'clashofclans.js'

import { CommandFile } from './types'
import { handleInteraction } from './interactions'
import { API_CREDENTIALS, DISCORD_TOKEN, VERIFICATION_CHANNEL, MEMBER_ROLE, memberRole, requestChannel, setRequestChannel, setMemberRole  } from './globals'

import fs from 'node:fs'


// Define both clients.
const clashClient = new Client()
const discordClient = new ExtendedClient({
    intents: [ discord.GatewayIntentBits.GuildMembers, discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.MessageContent ]
})

discordClient.once('ready', async () => {
    await clashClient.login({ email: API_CREDENTIALS.email, password: API_CREDENTIALS.password })
    console.log(`Logged in as ${discordClient.user!.username}!`)

    // Fetch all command files from the commands directory.
    let commandFiles = fs.readdirSync(__dirname + '/commands')

    // Loop through every command fild and dynamically import it and set it in the commands collection.
    for (let commandFile of commandFiles) {
        const command: CommandFile = await import(`./commands/${commandFile}`)
        discordClient.commands.set(command.builder.name, command.execute)
    }

    // Fetches and sets the requestChannel global variable.
    await setRequestChannel(discordClient)
})

discordClient.on('interactionCreate', async ( interaction: discord.Interaction ) => {
    // If member role is null or undefined, fetches the member role with defined ID in globals then sets the memberRole global variable to it's value.
    setMemberRole(interaction.guild!)

    if (interaction.isChatInputCommand()) {
        if (!interaction.inCachedGuild()) { // Just a type guard, should never happen due to the guilds intent.
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
    } else {
        // If the interaction isn't a command handle it through this function.
        await handleInteraction(discordClient, interaction)
    }
})


discordClient.login(DISCORD_TOKEN)