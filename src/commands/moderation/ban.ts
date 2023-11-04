import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the specified user for a given reason, and deletes messages from a given dutation.')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('The user to ban.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('The reason for banning.'))
		.addIntegerOption(option =>
			option.setName('duration')
			.setDescription('The amount of days from which to delete messages. Default is 0, max is 7.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		let member:any = interaction.options.getMember('user');
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.BanMembers)) {
					if (member.bannable) {
						await member.ban({deleteMessageSeconds: interaction.options.getInteger('duration')! * 60 *  60 * 24, reason: interaction.options.getString('reason')!});
						interaction.reply({content: `${member.user.tag} was banned.`, ephemeral: true});
					} else {
						interaction.reply({content: `${member.user.tag} is unbannable.`, ephemeral: true});
					}
				} else {
					interaction.reply({content: 'You do not have permission to ban.', ephemeral: true});
				}
			}
		}
	}
};