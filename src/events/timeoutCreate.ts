import { TextChannel, Guild } from 'discord.js';
import { Model } from 'sequelize';
import { Models } from '..';

module.exports = {
	name: 'timeoutCreate',
	once: false,
	async execute(data:any) {
		let guild:Guild = data.member.guild
		let settings:Model = (await Models.Settings.findOne({ where: { guildID: guild.id} }))!;
		if (guild.available && settings.getDataValue('modLogEnabled')) {
			let channel:any = await guild.channels.fetch(await settings.getDataValue('modLog'));
			if (channel instanceof TextChannel) {
				channel.send(`User ${data.member.user.tag} was timed out for ${data.duration} for "${data.reason}".`);
			} else {
				console.error('The selected channel is not a text channel. Please use `/modlog enable` with a valid channel.');
			}
		}
	}
};