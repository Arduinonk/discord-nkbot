const { Client, Interaction } = require('discord.js')
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands')
/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();
    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);
        if (!commandObject) return;
        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: `Only developers can use this Command`,
                    ephemeral: true
                });
                return;
            }
        }
        if (commandObject.testOnly) {
            if (!interaction.guild.id === testServer) {
                interaction.reply({
                    content: `This Command can run in only Testing Servers`,
                    ephemeral: true
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: `You dont have Permissions!`,
                        ephemeral: true
                    });
                    break;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: `You dont have enough Permissions!`,
                        ephemeral: true
                    });
                    break;
                }
            }
        }
 
        await commandObject.callback(client, interaction)

    } catch (error) {
        console.log(`There was an ERROR in HANDLE-COMMANDS: ${error}`);
    }

};


/*
function test(params) {

    client.on('ready', (data) => {
        console.log(`${data.user.username}-Bot is ONLINE!!!`)

        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);
        }, 10000)
    })
    client.on('interactionCreate', async (interaction) => {
        // if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'add') {
            const num1 = interaction.options.get('first-number')?.value;
            const num2 = interaction.options.get('second-number')?.value;
            interaction.reply(`${num1 + num2}`)
        }
        if (interaction.commandName === 'embed') {
            const embed = new EmbedBuilder()
                .setAuthor({ name: 'NK90Miner', iconURL: 'https://media.discordapp.net/attachments/1118078879282765916/1191103745623343256/f3efa256-8ed6-45df-bdc4-b18d1bc94d49.jpg?ex=65a438ce&is=6591c3ce&hm=4b24d8bf6aaa87a07c40e1fde849158636c647d5c6bac372a6fdd9546641ad55&=&format=webp&width=364&height=364', url: 'https://www.nk90miner.com' })
                .setTitle('Embed Title')
                .setDescription('Embed Description')
                .setURL('https://www.youtube.com/channel/UCgh3_mNT1qBwJIaAXighpZA')
                .setColor('Random')
                .setImage('https://i.ytimg.com/vi/CtH1AWab9Co/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&amp;rs=AOn4CLDg95-_F4UqEEUY_uhqMG5WRB8F8w')
                .addFields(
                    // { name: '1.Field', value: '1.Value', inline: true },
                    // { name: '2.Field', value: '2.Value', inline: true },
                    { name: '3.Field1111111111111111111111111111', value: '3.Value1111111111111111111111111111', inline: false })
                .setTimestamp()
                .setFooter({ text: 'Footer Text', iconURL: 'https://media.discordapp.net/attachments/1118078879282765916/1191103745623343256/f3efa256-8ed6-45df-bdc4-b18d1bc94d49.jpg?ex=65a438ce&is=6591c3ce&hm=4b24d8bf6aaa87a07c40e1fde849158636c647d5c6bac372a6fdd9546641ad55&=&format=webp&width=364&height=364' });

            interaction.reply({
                embeds: [
                    embed
                ]
            })
        }
        if (interaction.commandName === 'role_buttons') {
            try {
                const channel = await client.channels.cache.get('1129742360629227551')
                if (!channel) return;
                const row = new ActionRowBuilder();
                roles.forEach((role) => {
                    row.components.push(
                        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
                    );
                });

                await channel.send({
                    content: 'Claim or Remove a Role below',
                    components: [row]
                });
                // process.exit();
            } catch (error) {
                console.log(`${error} - !!!`)
            }
        }
        if (interaction.isButton()) {
            try {

                await interaction.deferReply({ ephemeral: true });

                const role = interaction.guild.roles.cache.get(interaction.customId)

                if (!role) {
                    interaction.editReply({
                        content: "I couldn't find that Role"
                    })
                    return;
                }
                const hasRole = interaction.member.roles.cache.has(role.id);
                if (hasRole) {
                    await interaction.member.roles.remove(role);
                    await interaction.editReply(`The Role ${role} has been Removed!`);
                    return;
                }
                await interaction.member.roles.add(role);
                await interaction.editReply(`The Role ${role} has been Added!`);
            } catch (error) {
                console.log(error)
            }
        }

    })

}
*/