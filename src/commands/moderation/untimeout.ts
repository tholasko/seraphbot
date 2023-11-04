import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Removes a specified user from timeout.')
        .addUserOption(option =>
			option.setName('user')
			.setDescription('Which user\'s timeout to remove.')
			.setRequired(true)),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let member:any = interaction.options.getMember('user')!;
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.ModerateMembers)) {
					await member.timeout(null);

					await interaction.reply({ content: `Timeout removed.`, ephemeral: true });
					interaction.client.emit('timeoutRemove', { member: member });
				}
			}
		}
	}
};
