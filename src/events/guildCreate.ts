import { Guild } from 'discord.js';
import { Models } from '..';
import { deployCommands } from '../deploy-commands';

module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(guild:Guild) {
		await Models.Settings.create({ guildID: guild.id });
		deployCommands();
	},
};