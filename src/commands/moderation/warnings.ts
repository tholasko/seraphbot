import { Model } from 'sequelize';
import { ChatInputCommandInteraction, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('Displays all warnings, or warnings from a specified user.')
        .addUserOption(option =>
			option.setName('user')
			.setDescription('Which user\'s warnings to view.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let user:any = interaction.options.getUser('user');
		let warnings:Array<Model> = []
		try { 
			warnings = user instanceof User ? await Models.Warns.findAll({ where: { guildID: interaction.guildId, userID: user.id } }) : await Models.Warns.findAll({ where: { guildID: interaction.guildId } });
		} catch (error:any) {
			console.error(error);
			return await interaction.reply({content: 'Something went wrong while fetching the warnings.', ephemeral: true});
		}
		warnings.sort((a:any, b:any) => a.get('date') - b.get('date'));

		let reply:string = '```\n';

		for (let i = 0; i < warnings.length; i++) {
			let user:User = await interaction.client.users.fetch(String(warnings[i].get('userID')))
			let reason:string = warnings[i].get('reason') === null ? '(no reason)' : String(warnings[i].get('reason'));
			let date:string = warnings[i].getDataValue('createdAt').toUTCString();
			
			reply += `${i+1}.\t${user.tag}\n${reason}\n${date}\n\n`
		}

		await interaction.reply(reply + '```');
	}
};
