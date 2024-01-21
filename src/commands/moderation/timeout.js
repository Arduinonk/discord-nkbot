const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply('That user doesn\'t exist in the server!');
            return;
        }
        if (targetUser.user.bot) {
            await interaction.editReply('I can\'t timeout a Bot!');
            return;
        }
        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply('Plaese provide a valid duration!');
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('TimeOut duration cannot be less than 5 seconds or more than 28 days.');
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You Can't TimeOut that user because they have the same or higher role than you");
            return;
        }
        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I Can't TimeOut that user because they have the same or higher role than me");
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');
            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeOut has been updated to ${prettyMs(msDuration, { verbose: true })} \nReason: ${reason}`);
                return;
            }
            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser}'s timedOut to ${prettyMs(msDuration, { verbose: true })} \nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an ERROR in TimeOut: ${error}`)
        }

    },

    name: 'timeout',
    description: 'TimeOut a User!',
    options: [
        {
            name: 'target-user',
            description: 'The User you want to TimeOut!',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'duration',
            description: 'TimeOut duration(30m, 1h, 1day)!',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason why you want to TimeOut this User!',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],

}