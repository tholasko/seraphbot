import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a summary of all commands.'),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;

		let embed:EmbedBuilder = new EmbedBuilder()
			.setAuthor({ name: interaction.client.user!.tag, iconURL: interaction.client.user!.displayAvatarURL() })
			.setTitle("Commands")
			.setColor(0xB3A2A8);

		for (const command of interaction.client.commands.keys()) {
			
			embed.addFields({ name: `/${command}`, value: `${interaction.client.commands.get(command).data.description}`, inline: false});
		}

		interaction.reply({ embeds: [embed] });

	}
};
