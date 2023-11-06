import { Model } from 'sequelize';
import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('Removes a warning from a specified user.')
        .addUserOption(option =>
			option.setName('user')
			.setDescription('Which user\'s warning to remove.')
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName('number')
			.setDescription('Which number warning to remove.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let member:any = interaction.options.getMember('user')!;
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.ModerateMembers)) {
					let warnings:Array<Model> = await Models.Warns.findAll({ where: { guildID: interaction.guildId, userID: member.id } });
					warnings.sort((a:any, b:any) => a.get('date') - b.get('date'));

					try {
						await Models.Warns.destroy({ where: { createdAt: String(warnings[interaction.options.getInteger('number')!-1].get('createdAt')) } });
					} catch(error:any) {
						return await interaction.reply({ content: 'That warning does not exist.', ephemeral: true });
					}

					await interaction.reply({ content: `Warning removed.`, ephemeral: true });
					interaction.client.emit('warningRemove', { member: member });
				}
			}
		}
	}
};
