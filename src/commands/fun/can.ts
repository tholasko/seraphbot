import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('can')
		.setDescription('Pick up that can.')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('The person who needs to pick up that can.')
			.setRequired(true)),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		await interaction.reply({ content: `<@${interaction.options.getUser('user')!.id}> Pick up that can.`, files: [new AttachmentBuilder('./res/thatcan.png')] });
	}
};
