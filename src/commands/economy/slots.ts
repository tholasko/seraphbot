import { Model } from 'sequelize';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Step right up and take a gamble!')
		.addIntegerOption(option =>
			option.setName('bet')
			.setDescription('The amount to bet. Default is $10.')),
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

		if (economy!.get('balance') as number < (interaction.options.getInteger('bet') ? interaction.options.getInteger('bet')! : 10) ) return await interaction.reply({content: 'You\'re too broke to bet that much!', ephemeral: true});

		economy!.set('balance', economy!.get('balance') as number - interaction.options.getInteger('bet')!);
		economy!.save()

		let winnings:number = 0;
		let display:Array<string> = [];
		let displaySize = 3;
		let possibleValues:Array<string> = ['🍋','🍉','🍎','🍇','🍒','🍀','🪙','💵','💎','7️⃣'];

		for (let i = 0; i < displaySize; i++) {
			display.push(possibleValues[Math.floor(Math.random()*possibleValues.length)])
		}

		await interaction.reply(display.join(''));

		function largestConsecutiveDuplicate(arr: string[]): { duplicate: string; count: number } {
			let currentDuplicate = arr[0];
			let currentCount = 1;
			let maxDuplicate = arr[0];
			let maxCount = 1;

			for (let i = 1; i < arr.length; i++) {
				if (arr[i] === arr[i - 1]) {
					currentCount++;
				} else {
					if (currentCount > maxCount) {
						maxCount = currentCount;
						maxDuplicate = currentDuplicate;
					}
					currentDuplicate = arr[i];
					currentCount = 1;
				}
			}

			if (currentCount > maxCount) {
				maxCount = currentCount;
				maxDuplicate = currentDuplicate;
			}

			return { duplicate: maxDuplicate, count: maxCount };
		}

		let result = largestConsecutiveDuplicate(display);

		switch (result.count) {
			case (2):
				winnings = (possibleValues.indexOf(result.duplicate) + 1) * interaction.options.getInteger('bet')!;
				break;
			case (3):
				winnings = 2 * (possibleValues.indexOf(result.duplicate) + 1) * interaction.options.getInteger('bet')!;
				break;
		}

		economy!.set('balance', (economy!.get('balance') as number) + winnings);
		economy!.save();

		await interaction.editReply(`${display.join('')}\nYou won $${winnings}!`);
	}
};
