const { Client, GuildMember } = require('discord.js');
const AutoRole = require('../../models/AutoRoles')

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;
        const autoRole = await AutoRole.findOne({ guildId: guild.id });
        if (!autoRole) return;
        await member.roles.add(autoRole.roleId);

    } catch (error) {
        console.log(`There was an ERROR in autorole.js! Error giving role automatically: ${error}`)
    }
}