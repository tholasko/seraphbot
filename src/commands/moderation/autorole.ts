import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autorole')
		.setDescription('Automatically applies a role upon joining the server. Not specifying a role clears the autorole.')
        .addRoleOption(option =>
			option.setName('role')
			.setDescription('The role to automatically apply.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let role:any = interaction.options.getRole('role');
		let perms:string|PermissionsBitField = interaction.member!.permissions;
		if (perms instanceof PermissionsBitField) {
			if (perms.has(PermissionsBitField.Flags.Administrator)) {
				try {
                    await Models.Settings.update({ autorole: role === null ? '' : role.id }, { where: { guildID: interaction.guildId } });
                    await interaction.reply({content: `Autorole ${role === null ? 'cleared' : 'set to "' + role.name + '"'}.`, ephemeral: true});
                }
                catch (error:any) {
                    await interaction.reply({content: 'Something went wrong while adding your autorole.', ephemeral: true});
                    console.error(error);
                }
			} else {
				await interaction.reply({content: 'You do not have permission to modify the autorole.', ephemeral: true});
			}
		}    
	}
};
