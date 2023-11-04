import { ChatInputCommandInteraction, Message, AttachmentBuilder, GuildMember, Collection } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import sharp from 'sharp';
import { Canvacord } from 'canvacord';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Applies various effects to images.')
		.addSubcommand(subcommand =>
			subcommand.setName('affect')
			.setDescription('No it doesn\'t affect my baby.'))
		.addSubcommand(subcommand =>
			subcommand.setName('avatar')
			.setDescription('Returns a given user\'s avatar.')
			.addUserOption(option =>
				option.setName('user')
				.setDescription('Which user to get the avatar from.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('beautiful')
			.setDescription('Oh this? This is beautiful!'))
		.addSubcommand(subcommand =>
			subcommand.setName('blur')
			.setDescription('Blur an image.'))
		.addSubcommand(subcommand =>
			subcommand.setName('brightness')
			.setDescription('Edit an image\'s brightness by an amount.')
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount of brightness.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('burn')
			.setDescription('Applies burn effect on an image.')
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount of char.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('colorfy')
			.setDescription('Changes the color of an image.')
			.addStringOption(option =>
				option.setName('color')
				.setDescription('The HTML5 color.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('darkness')
			.setDescription('Edit an image\'s darkness by an amount.')
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount of darkness.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('distracted')
			.setDescription('Are you really looking at her right now?')
			.addUserOption(option =>
				option.setName('girlinred')
				.setDescription('The girl in red.')
				.setRequired(true))
			.addUserOption(option =>
				option.setName('boyfriend')
				.setDescription('The boyfriend.')
				.setRequired(true))
			.addUserOption(option =>
				option.setName('girlfriend')
				.setDescription('The girlfriend.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('facepalm')
			.setDescription('facepalm'))
		.addSubcommand(subcommand =>
			subcommand.setName('greyscale')
			.setDescription('Applies a greyscale effect to an image.'))
		.addSubcommand(subcommand =>
			subcommand.setName('hitler')
			.setDescription('Worse than hitler.'))
		.addSubcommand(subcommand =>
			subcommand.setName('invert')
			.setDescription('Inverts the color of an image.'))
		.addSubcommand(subcommand =>
			subcommand.setName('jail')
			.setDescription('Go to jail.')
			.addBooleanOption(option =>
				option.setName('greyscale')
				.setDescription('Whether or not to greyscale.')))
		.addSubcommand(subcommand =>
			subcommand.setName('thejoke')
			.setDescription('There it goes, over your head!'))
		.addSubcommand(subcommand =>
			subcommand.setName('pixelate')
			.setDescription('Pixelates an image.')
			.addIntegerOption(option =>
				option.setName('pixels')
				.setDescription('The number of pixels.')))
		.addSubcommand(subcommand =>
			subcommand.setName('rainbow')
			.setDescription('Applies a rainbow effect to an image.'))
		.addSubcommand(subcommand =>
			subcommand.setName('resize')
			.setDescription('Resizes an image to a given width and height.')
			.addIntegerOption(option =>
				option.setName('width')
				.setDescription('The width.')
				.setRequired(true))
			.addIntegerOption(option =>
				option.setName('height')
				.setDescription('The height.')
				.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('rip')
			.setDescription('Fs in chat boys.'))
		.addSubcommand(subcommand =>
			subcommand.setName('sepia')
			.setDescription('Applies a sepia effect to an image.'))
		.addSubcommand(subcommand =>
			subcommand.setName('sharpen')
			.setDescription('Sharpens an image by an amount.')
			.addIntegerOption(option =>
				option.setName('amount')
				.setDescription('The amount to sharpen.')))
		.addSubcommand(subcommand =>
			subcommand.setName('trash')
			.setDescription('Trash?'))
		.addSubcommand(subcommand =>
			subcommand.setName('triggered')
			.setDescription('REEEEEEE'))
		.addSubcommand(subcommand =>
			subcommand.setName('wanted')
			.setDescription('Dead or alive.'))
		.addSubcommand(subcommand =>
			subcommand.setName('wasted')
			.setDescription('RIP.')),
	async execute(interaction:ChatInputCommandInteraction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();
		let messages = await interaction.channel!.messages.fetch()
		let messagesWithAttachments:Collection<string, Message> = messages.filter(message => (message.attachments.size > 0))
		if (messagesWithAttachments.size === 0) {
			return await interaction.reply({ content: 'This channel has no messages with attachments.', ephemeral: true})
		}
		let messagesWithImages:Collection<string, Message> = messagesWithAttachments.filter(message => (message.attachments.first()!.contentType!.includes('image')))
		if (messagesWithImages.size === 0) {
			return await interaction.reply({ content: 'This channel has no images.', ephemeral: true})
		}
		let latestMessageAttachment:any = messagesWithImages.first()!.attachments.first()!;

		let urlResponse:any = await axios.get(latestMessageAttachment.url,  { responseType: 'arraybuffer' })
		let image:Buffer = (await sharp(Buffer.from(urlResponse.data, 'utf-8')).png().toBuffer({ resolveWithObject: true })).data

		let newImage:Buffer;
		let imageName:string = 'file.png';

		let subcommand:string = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'affect':
				newImage = await Canvacord.affect(image!);
				break;
			case 'avatar':
				let member = interaction.options.getMember('user')!
				if (member instanceof GuildMember) {
					let response:any = await axios.get(member.displayAvatarURL(),  { responseType: 'arraybuffer' })
					newImage = (await sharp(Buffer.from(response.data, 'utf-8')).png().toBuffer({ resolveWithObject: true })).data
				}
				break;
			case 'beautiful':
				newImage = await Canvacord.beautiful(image!);
				break;
			case 'blur':
				newImage = await Canvacord.blur(image!);
				break;
			case 'brightness':
				newImage = await Canvacord.brightness(image!, interaction.options.getInteger('amount')!);
				break;
			case 'burn':
				newImage = await Canvacord.burn(image!, interaction.options.getInteger('amount')!);
				break;
			case 'colorfy':
				newImage = await Canvacord.colorfy(image!, interaction.options.getString('color')!);
				break;
			case 'darkness':
				newImage = await Canvacord.darkness(image!, interaction.options.getInteger('amount')!);
				break;
			case 'distracted':
				let girlInRedUser = interaction.options.getMember('girlinred')!
				let boyfriendUser = interaction.options.getMember('boyfriend')!
				let girlfriendUser = interaction.options.getMember('girlfriend')!
				if (girlInRedUser instanceof GuildMember && boyfriendUser instanceof GuildMember && girlfriendUser instanceof GuildMember) {
					let girResponse:any = await axios.get(girlInRedUser.displayAvatarURL(),  { responseType: 'arraybuffer' })
					let girlInRed = (await sharp(Buffer.from(girResponse.data, 'utf-8')).png().toBuffer({ resolveWithObject: true })).data

					let bfResponse:any = await axios.get(boyfriendUser.displayAvatarURL(),  { responseType: 'arraybuffer' })
					let boyfriend = (await sharp(Buffer.from(bfResponse.data, 'utf-8')).png().toBuffer({ resolveWithObject: true })).data

					let gfResponse:any = await axios.get(girlfriendUser.displayAvatarURL(),  { responseType: 'arraybuffer' })
					let girlfriend = (await sharp(Buffer.from(gfResponse.data, 'utf-8')).png().toBuffer({ resolveWithObject: true })).data

					newImage = await Canvacord.distracted(girlInRed, boyfriend, girlfriend);
				}
				break;
			case 'facepalm':
				newImage = await Canvacord.facepalm(image!);
				break;
			case 'greyscale':
				newImage = await Canvacord.greyscale(image!);
				break;
			case 'hitler':
				newImage = await Canvacord.hitler(image!);
				break;
			case 'invert':
				newImage = await Canvacord.invert(image!);
				break;
			case 'jail':
				let greyscale:boolean|null = interaction.options.getBoolean('greyscale');
				newImage = await Canvacord.jail(image!, greyscale === null ? false : greyscale!);
				break;
			case 'thejoke':
				newImage = await Canvacord.jokeOverHead(image!);
				break;
			case 'pixelate':
				let pixels:number|null = interaction.options.getInteger('pixels')
				newImage = await Canvacord.pixelate(image!, pixels === null ? 5 : pixels);
				break;
			case 'rainbow':
				newImage = await Canvacord.rainbow(image!);
				break;
			case 'resize':
				newImage = await Canvacord.resize(image!, interaction.options.getInteger('width')!, interaction.options.getInteger('height')!);
				break;
			case 'rip':
				newImage = await Canvacord.rip(image!);
				break;
			case 'sepia':
				newImage = await Canvacord.sepia(image!);
				break;
			case 'sharpen':
				newImage = await Canvacord.sharpen(image!, interaction.options.getInteger('amount')!);
				break;
			case 'trash':
				newImage = await Canvacord.trash(image!);
				break;
			case 'triggered':
				newImage = await Canvacord.trigger(image!);
				imageName = 'file.gif';
				break;
			case 'wanted':
				newImage = await Canvacord.wanted(image!);
				break;
			case 'wasted':
				newImage = await Canvacord.wasted(image!);
				break;
		}

		await interaction.editReply({ files: [{ attachment: newImage!, name: imageName }]})
		
	}
};
