import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns a user for a given reason.')
        .addUserOption(option =>
			option.setName('user')
			.setDescription('The user to warn.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
			.setDescription('The reason for warning.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let member = interaction.options.getMember('user')!;
		if (member instanceof GuildMember) {
			let perms:string|PermissionsBitField = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.ModerateMembers)) {
					try {
                        await Models.Warns.create({
                            guildID: interaction.guildId,
                            userID: member.id,
                            reason: interaction.options.getString('reason')
                        });
                        await interaction.reply({content: `${interaction.options.getUser('user')!.tag} was warned.`, ephemeral: true});
						interaction.client.emit('warningCreate', { member: member, reason: interaction.options.getString('reason') === null ? '(no reason)' : interaction.options.getString('reason') });
                    }
                    catch (error:any) {
                        console.error(error);
                        await interaction.reply({content: 'Something went wrong while adding your warning.', ephemeral: true});
                    }
				} else {
					await interaction.reply({content: 'You do not have permission to warn.', ephemeral: true});
				}
			}
		}
        
	}
};
