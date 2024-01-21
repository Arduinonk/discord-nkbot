const { Client, Interaction, AttachmentBuilder } = require('discord.js');
const Welcome = require('../../models/Welcome')
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'test',
    description: 'Replies with the test!',
    // devOnly: true,
    // testOnly: true,
    // options: [{}],
    deleted: true,
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();


        const canvas = createCanvas(1000, 600);
        const ctx = canvas.getContext('2d');
        const avatar = await loadImage(interaction.user.avatarURL({ extension: 'png' }));
        const background = await loadImage('https://raw.githubusercontent.com/Arduinonk/nk90miner/main/welcome_background.png');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        { // UserName
            ctx.font = 'bold 70px Sans';
            ctx.strokeStyle = '#050505';
            ctx.lineWidth = 4;
            ctx.strokeText((interaction.user.displayName + '(@' + interaction.user.username + ')').toString(), 400, 250, 550);
            ctx.fillStyle = '#01d8fe';
            ctx.textAlign = 'start';
            ctx.fillText((interaction.user.displayName + '(@' + interaction.user.username + ')').toString(), 400, 250, 550);
        }
        { // Member Count
            ctx.font = 'bold 30px Sans';
            ctx.fillStyle = '#8cfe01';
            ctx.textAlign = 'end';
            ctx.fillText((('Üye sayısı:' + interaction.guild.memberCount)).toString(), 970, 40, 550);
        }
        { // Draw Avatar
            ctx.beginPath();
            ctx.arc(200, 200, 160, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 40, 40, 320, 320);
        }
        { // StatusColor
            ctx.beginPath();
            ctx.arc(200, 200, 160, 0, 2 * Math.PI);
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#a4a4a4';
            ctx.stroke();
            ctx.closePath();
        }
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });

        interaction.editReply({ files: [attachment] });
    }
};