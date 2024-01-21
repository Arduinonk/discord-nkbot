const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../../models/Welcome');

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
        
        try {
            await interaction.deferReply();

            let welcome = await Welcome.findOne({ guildId: interaction.guild.id });
            if (welcome) {
                if (!welcome.status) {
                    interaction.editReply('Welcome card is already turned OFF. To enable run `/welcome-enable`');
                    return;
                }
                welcome.status = false;
            } else {
                welcome = new Welcome({
                    guildId: interaction.guild.id,
                    status: false
                });
            }

            await welcome.save();
            interaction.editReply('Welcome card is already turned OFF. To enable run `/welcome-enable`')
        } catch (error) {
            console.log(`There was an ERROR in welcome-disable.js: ${error}`)
        }

    },

    name: 'welcome-disable',
    description: 'Disable Welcome card for this Server',
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles]
};