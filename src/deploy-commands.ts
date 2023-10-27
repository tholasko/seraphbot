import { REST, Routes } from 'discord.js';
import { clientId, token } from '../config.json';
import fs from 'fs';
import path from 'path';


export async function deployCommands() {
    const commands:string[] = [];

    const foldersPath:string = path.join(__dirname, 'commands');
    const commandFolders:string[] = fs.readdirSync(foldersPath);
    
    for (const folder of commandFolders) {
        const commandsPath:string = path.join(foldersPath, folder);
        const commandFiles:string[] = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath:string = path.join(commandsPath, file);
            const command = await import(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest:REST = new REST().setToken(token);

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data:any = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}
