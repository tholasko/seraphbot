import { ChatInputCommandInteraction, GuildChannel, PermissionsBitField } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Models } from '../..';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modlog')
		.setDescription('Allows the bot to send messages to a specific channel when someone is kicked, banned etc.')
		.addSubcommand(subcommand =>
			subcommand.setName('enable')
			.setDescription('Enables the mod log in a specific channel.')
			.addChannelOption(option =>
				option.setName('channel')
				.setDescription('The name of the channel to send mod logs to.')
				.setRequired(true)))
        .addSubcommand(subcommand =>
			subcommand.setName('disable')
			.setDescription('Disables the mod log.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
        let channel = interaction.options.getChannel('channel')!;
		if (channel instanceof GuildChannel) {
			let perms:any = interaction.member!.permissions;
			if (perms instanceof PermissionsBitField) {
				if (perms.has(PermissionsBitField.Flags.Administrator)) {
					try {
						let subcommand:string = interaction.options.getSubcommand();
						if (subcommand === 'enable') {
        	            	await Models.Settings.update({ modLog: channel.id, modLogEnabled: true }, { where: { guildID: interaction.guildId } });
    	                	await interaction.reply({ content: `Mod log enabled, and channel set to "${channel}".`, ephemeral: true});
						} else if (subcommand === 'disable') {
							await Models.Settings.update({ modLog: '', modLogEnabled: false }, { where: { guildID: interaction.guildId } });
                	    	await interaction.reply({ content: `Mod log disabled.`, ephemeral: true});
						}
        	        }
    	            catch (error:any) {
                    	console.error(error);
                	    return await interaction.reply({content: 'Something went wrong while setting your mod log channel.', ephemeral: true});
            	    }
				} else {
					return await interaction.reply({content: 'You do not have permission to modify the mod log channel.', ephemeral: true});
				}
			}
		}
	}
};
