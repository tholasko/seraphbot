import { Events, Client } from 'discord.js';
import { deployCommands } from '../deploy-commands';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client:Client) {
		console.log(`Logged in as ${client.user!.tag}`);
        deployCommands();
	},
};
