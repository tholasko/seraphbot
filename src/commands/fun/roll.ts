import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { DiceRoller, DiscordRollRenderer } from "dice-roller-parser";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll some dice!')
		.addStringOption(option => 
			option.setName('command')
			.setDescription('The Roll20 command to roll.')
			.setRequired(true)
		),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let diceRoller = new DiceRoller();
		let discordRollRenderer = new DiscordRollRenderer();
        let roll = diceRoller.roll(interaction.options.getString('command')!)
		let renderedRoll = discordRollRenderer.render(roll);
        await interaction.reply(renderedRoll);
	},
};
