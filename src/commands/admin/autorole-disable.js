const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRoles');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            if(!(await AutoRole.exists({guildId: interaction.guild.id}))){
                interaction.editReply('AutoRole has not been configured for this server. Use `/autorole-configure` to set it up.');
                return;
            }
            await AutoRole.findOneAndDelete({guildId: interaction.guild.id});
            interaction.editReply('AutoRole has not been configured for this server. Use `/autorole-configure` to set it up again!');

        } catch (error) {
            console.log(`There was an ERROR in autorole-disable.js: ${error}`)
        }
    },

    name: 'autorole-disable',
    description: 'Disable AutoRole in this server.',
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
    permissionsRequired: [PermissionFlagsBits.Administrator]
};