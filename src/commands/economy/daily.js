const { Client, Interaction, Guild } = require('discord.js');
const User = require('../../models/User');
const dailyAmount = 50;

module.exports = {
    name: 'daily',
    description: 'Collect your dailies!',
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({ content: 'You can Run this command in the Server!', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id
            };

            let user = await User.findOne(query);

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString()

                if (lastDailyDate === currentDate) {
                    interaction.editReply({
                        content: 'You have already collected your dailies today. Come back tomorrow!',
                        ephemeral: true
                    }
                    );
                    return;
                }
            } else {
                user = new User({
                    ...query,
                    lastDaily: new Date()
                });
            }

            user.balance += dailyAmount;
            await user.save();

            interaction.editReply(`${dailyAmount} was added to your balance. Your new balance is ${user.balance}!`);

        } catch (error) {
            console.log(`There was an ERROR in Daily: ${error}`)
        }
    }
}