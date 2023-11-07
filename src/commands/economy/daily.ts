import { Model } from 'sequelize';
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
				balance: 0,
				dailyLastClaimed: new Date(new Date().getTime() - 86400000)
			});

			try { 
				economy = await Models.Economy.findOne({ where: { guildID: interaction.guildId, userID: interaction.user.id } });
			} catch (error:any) {
				console.error(error);
				return await interaction.reply({content: 'Something went wrong while claiming your daily.', ephemeral: true});
			}
		}

		if ((economy!.get('dailyLastClaimed') as Date).getTime() - new Date().getTime() <= -86400000) {
			economy!.set('balance', (economy!.get('balance') as number) + 10);
			economy!.set('dailyLastClaimed', new Date());
			economy!.save()

			await interaction.reply({ content: `You now have $${economy!.get('balance')}!`, ephemeral: true });
		} else {
			await interaction.reply({ content: `You must wait ${(new Date((economy!.get('dailyLastClaimed') as Date).getTime() - new Date().getTime() + 86400000)).getUTCHours()} hours to claim again.`, ephemeral: true });
		}
	}
};
