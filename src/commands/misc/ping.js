module.exports = {
    name: 'ping',
    description: 'Replies with the bot Ping!',
    // devOnly: true,
    // testOnly: true,
    // options: [{}],
    // deleted: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        interaction.editReply(`Pong! Client: ${ping}ms | WebSocket: ${client.ws.ping}ms`);
    }
};