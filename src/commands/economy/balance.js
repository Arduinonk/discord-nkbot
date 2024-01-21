const { Client, Interaction, Guild, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const dailyAmount = 50;

module.exports = {
    name: 'balance',
    description: 'Check your balance!',
    options: [
        {
            name: 'user',
            description: 'The user whose balance you want to get',
            type: ApplicationCommandOptionType.User
        }
    ],
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

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;


        try {
            await interaction.deferReply({ ephemeral: true });

            const query = {
                userId: targetUserId,
                guildId: interaction.guild.id
            };

            const user = await User.findOne(query);

            if (user) {
                if (targetUserId === interaction.member.id) {
                    interaction.editReply({
                        content: `Your balance is **${user.balance}**`,
                        ephemeral: true
                    }
                    );
                } else {
                    interaction.editReply({
                        content: `<@${targetUserId}>'s balance is **${user.balance}**`,
                        ephemeral: true
                    }
                    );
                }
            }
            else {
                user = new User({
                    ...query,
                    balance: 0
                });
                if (targetUserId === interaction.member.id) {
                    interaction.editReply({
                        content: `Your balance is **${user.balance}**`,
                        ephemeral: true
                    }
                    );
                } else {
                    interaction.editReply({
                        content: `<@${targetUserId}>'s balance is **${user.balance}**`,
                        ephemeral: true
                    }
                    );
                }
            }

        } catch (error) {
            console.log(`There was an ERROR in balance: ${error}`)
        }
    }
}