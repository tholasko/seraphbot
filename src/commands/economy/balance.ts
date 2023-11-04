import { Model } from 'sequelize';
import { ChatInputCommandInteraction, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows how much money you or another user has.')
        .addUserOption(option =>
			option.setName('user')
			.setDescription('Which user\'s balance to view.')),
	async execute(interaction:ChatInputCommandInteraction) {
        let user:any = interaction.options.getUser('user');
		let economy:Model|null;
		try { 
			economy = user instanceof User ? await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: user.id } }) : await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: interaction.user.id } });
		} catch (error:any) {
			console.error(error);
			return await interaction.reply({content: 'Something went wrong while fetching the balance.', ephemeral: true});
		}

		if (economy === null) {
			await Models.Economy.create({
				guildID: interaction.guildId,
				userID: user ?? interaction.user.id,
				balance: 10,
				dailyLastClaimed: 0
			});

			try { 
				economy = user instanceof User ? await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: user.id } }) : await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: interaction.user.id } });
			} catch (error:any) {
				console.error(error);
				return await interaction.reply({content: 'Something went wrong while fetching the balance.', ephemeral: true});
			}
		}

		await interaction.reply({ content: `You have $${economy!.get('balance')}`, ephemeral: true });
	}
};