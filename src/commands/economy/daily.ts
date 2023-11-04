import { Model, DataTypes } from 'sequelize';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claims your daily or shows the time left until you can claim.'),
	async execute(interaction:ChatInputCommandInteraction) {
		let economy:Model|null;
		try { 
			economy = await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: interaction.user.id } });
		} catch (error:any) {
			console.error(error);
			return await interaction.reply({content: 'Something went wrong while claiming your daily.', ephemeral: true});
		}

		if (economy === null) {
			await Models.Economy.create({
				guildID: interaction.guildId,
				userID: interaction.user.id,
				balance: 10,
				dailyLastClaimed: 0
			});

			try { 
				economy = await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: interaction.user.id } });
			} catch (error:any) {
				console.error(error);
				return await interaction.reply({content: 'Something went wrong while claiming your daily.', ephemeral: true});
			}
		}

		if ((economy!.get('dailyLastClaimed') as Date).getTime() - (DataTypes.NOW() as unknown as Date).getTime()) {

		}

		await interaction.reply({ content: `You have $${economy!.get('dailyLastClaimed')}`, ephemeral: true });
	}
};
