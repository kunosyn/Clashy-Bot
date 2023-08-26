const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands: any = [];
const clientId = '1141212898195165264'
const guildId = '1140097828543279105'
const token = 'REDACTED'
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
let commandFiles: any = fs.readdirSync(foldersPath)

console.log(commandFiles)
commandFiles = commandFiles.filter((file: string) => file.endsWith('.js'));

(async () => {
	for (const file of commandFiles) {
		
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        const filePath = path.join(foldersPath, file)
		const command = await import(filePath);
		if ('builder' in command && 'execute' in command) {
            console.log(command.builder.toJSON())
			commands.push(command.builder.toJSON());
		} else {
			console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
		}
	}
    const rest = new REST().setToken(token);
    try {
        console.log(commands)
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
