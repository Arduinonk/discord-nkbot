const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No Reason provided!";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply("That User Doesn't Exist in the Server!")
            return;
        }
        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You Can't Kick this User! Because they are the server Owner!")
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You Can't kick that user because they have the same or higher role than you");
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I Can't Kick that user because they have the same or higher role than me");
            return;
        }
        try {
            await targetUser.kick({ reason: reason });
            await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`)
        } catch (error) {
            console.log(`There was an ERROR in Kick: ${error}`)
        }
    },

    name: 'kick',
    description: 'Kicks a member from the Server.',
    devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'target-user',
            description: 'The User to KICK from server',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'Kick Reason',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers]
}