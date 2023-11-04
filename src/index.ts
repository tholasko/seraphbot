import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { Sequelize, DataTypes } from 'sequelize';
import { token, dbUsername, dbPassword, dbPath } from '../config.json';

declare module "discord.js" {
    interface Client {
        commands: Collection<string, any>
    }
}

export const client:Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });
client.commands = new Collection();

const sequelize:Sequelize = new Sequelize('database', dbUsername, dbPassword, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: dbPath,
});

export const Models = {
	Warns: sequelize.define('warns', {
		guildID: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		userID: DataTypes.STRING,
		reason: DataTypes.TEXT
	}),
	Settings: sequelize.define('settings', {
		guildID: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true
		},
		autorole: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		modLog: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		modLogEnabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}),
	Economy : sequelize.define('economy', {
		guildID: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		userID: DataTypes.STRING,
		balance: DataTypes.NUMBER,
		dailyLastClaimed: DataTypes.DATEONLY
	})

};

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