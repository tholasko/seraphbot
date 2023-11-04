import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks the specified user for a given reason.')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('The user to kick.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('The reason for kicking.')),
	async execute(interaction:ChatInputCommandInteraction) {
        if (!interaction.isCommand()) return;
		let member:any = interaction.options.getMember('user');
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.KickMembers)) {
					if (member.kickable) {
						await member.kick(String(interaction.options.getString('reason')));
						interaction.reply({content: `${member.user.tag} was kicked.`, ephemeral: true});
						interaction.client.emit('kickCreate', { member: member, reason: interaction.options.getString('reason') });
					} else {
						interaction.reply({content: `${member.user.tag} is unkickable.`, ephemeral: true});
					}
				} else {
					interaction.reply({content: 'You do not have permission to kick.', ephemeral: true});
				}
			}
		}
	}
};