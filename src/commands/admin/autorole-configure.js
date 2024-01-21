const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRoles');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }
        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();

            let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });
            if (autoRole) {
                if (autoRole.roleId === targetRoleId) {
                    interaction.editReply('Aut role has already benn configured for that Role. To disable run `/autorole-disable`');
                    return;
                }
                autoRole.roleId = targetRoleId;
            } else {
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId
                });
            }

            await autoRole.save();
            interaction.editReply('AutoRole has now been configured. To disable run `/autorole-disable`')
        } catch (error) {
            console.log(`There was an ERROR in autorole-configure.js: ${error}`)
        }

    },

    name: 'autorole-configure',
    description: 'Configure your auto-role for this Server',
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'role',
            description: 'The role you ant users to get on Jion.',
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles]
};