import { Events, Client } from 'discord.js';
import { deployCommands } from '../deploy-commands';
import { Models } from '..';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client:Client) {
		console.log(`Logged in as ${client.user!.tag}`);
        deployCommands();

		Models.Warns.sync();
	    Models.Settings.sync();
		Models.Economy.sync();
	},
};
