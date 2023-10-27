import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { token } from '../config.json';

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>
    }
}

export const client:Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });
client.commands = new Collection();

const foldersPath:string = path.join(__dirname, 'commands');
const commandFolders:string[] = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath:string = path.join(foldersPath, folder);
	const commandFiles:string[] = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath:string = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath:string = path.join(__dirname, 'events');
const eventFiles:string[] = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
	const filePath:string = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);