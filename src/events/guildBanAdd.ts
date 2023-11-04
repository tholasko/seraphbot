import { TextChannel, Guild, GuildBan } from 'discord.js';
import { Model } from 'sequelize';
import { Models } from '..';

module.exports = {
	name: 'guildBanAdd',
	once: false,
	async execute(ban:GuildBan) {
		let guild:Guild = ban.guild
		let settings:Model = (await Models.Settings.findOne({ where: { guildID: guild.id} }))!;
		if (guild.available && settings.getDataValue('modLogEnabled')) {
			let channel:any = await guild.channels.fetch(await settings.getDataValue('modLog'));
			if (channel instanceof TextChannel) {
				channel.send(`User ${ban.user.tag} was banned for "${(await ban.fetch(true)).reason}".`);
			} else {
				console.error('The selected channel is not a text channel. Please use `/modlog enable` with a valid channel.');
			}
		}
	}
};