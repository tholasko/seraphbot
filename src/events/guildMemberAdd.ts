import { GuildMember } from 'discord.js';
import { Model } from 'sequelize';
import { Models } from '..';

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async execute(member:GuildMember) {
		let settings:Model = (await Models.Settings.findOne({ where: { guildID: member.guild.id } }))!;
		let autoRoleID = String(settings.get('autorole'));
		if (autoRoleID !== '') {
			await member.roles.add(autoRoleID)
		}
	},
};