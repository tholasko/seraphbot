import { TextChannel, Guild } from 'discord.js';
import { Model } from 'sequelize';
import { Models } from '..';

module.exports = {
	name: 'timeoutRemove',
	once: false,
	async execute(data:any) {
		let guild:Guild = data.member.guild
		let settings:Model = (await Models.Settings.findOne({ where: { guildID: guild.id} }))!;
		if (guild.available && settings.getDataValue('modLogEnabled')) {
			let channel:any = await guild.channels.fetch(await settings.getDataValue('modLog'));
			if (channel instanceof TextChannel) {
				channel.send(`User ${data.member.user.tag} was removed from timeout.`);
			} else {
				console.error('The selected channel is not a text channel. Please use `/modlog enable` with a valid channel.');
			}
		}
	}
};