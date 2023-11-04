import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Replies with information about a specific user.')
		.addUserOption(option => 
			option.setName('user')
			.setDescription('The user to get information about.')
			.setRequired(true)
		),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		let member = interaction.options.getMember('user')!;
		if (member instanceof GuildMember) {
			let embed:EmbedBuilder = new EmbedBuilder()
				.setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
				.setColor(0xB3A2A8)
				.addFields([
					{ name: 'Join date:', value: `${member.joinedAt!.toUTCString()} (${member.joinedTimestamp})`, inline: true },
					{ name: 'Account created:', value: `${member.user.createdAt.toUTCString()} (${member.user.createdTimestamp})`, inline: true }
				])
				.setFooter({ text: `ID: ${member.id}` });
			return await interaction.reply({ embeds: [embed] });
		}
	}
};
