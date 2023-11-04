import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import parse from 'parse-duration';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Times out the specified user for a given reason.')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('The user to time out.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('duration')
			.setDescription('The duration of the timeout. Formatted (number)(s/m/h/d/w/y).')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('The reason for timing out.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		let member:any = interaction.options.getMember('user');
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.ModerateMembers)) {
					if (member.moderatable) {
						let parsedDuration:number|undefined = parse(String(interaction.options.getString('duration')))
						if (parsedDuration === undefined) {
							interaction.reply({content: `"${String(interaction.options.getString('duration'))}" is not a valid duration.`, ephemeral: true});
						} else {
							await member.timeout(parsedDuration, String(interaction.options.getString('reason')));
							interaction.reply({content: `${member.user.tag} was timed out.`, ephemeral: true});
							interaction.client.emit('timeoutCreate', { member: member, duration: interaction.options.getString('duration'), reason: interaction.options.getString('reason') });
						}
					} else {
						interaction.reply({content: `${member.user.tag} is unable to be timed out.`, ephemeral: true});
					}
				} else {
					interaction.reply({content: 'You do not have permission to time out.', ephemeral: true});
				}
			}
		}
	}
};
