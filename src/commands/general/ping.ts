import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		await interaction.reply('Pong!');
	},
};
