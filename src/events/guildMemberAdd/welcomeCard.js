const { Client, GuildMember, AttachmentBuilder } = require('discord.js');
const Welcome = require('../../models/Welcome')
const { createCanvas, loadImage } = require('canvas');

/**
 * 
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;
        const welcome = await Welcome.findOne({ guildId: guild.id });
        if (!welcome) return;


        const canvas = createCanvas(1000, 600);
        const ctx = canvas.getContext('2d');
        const background = await loadImage('https://raw.githubusercontent.com/Arduinonk/nk90miner/main/welcome_background.png');
        const avatar = await loadImage(member.user.avatarURL({ extension: 'png' }));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        {
            ctx.font = 'bold 70px Sans';
            ctx.strokeStyle = '#050505';
            ctx.lineWidth = 4;
            ctx.strokeText(member.user.displayName, 400, 250, 550);
            ctx.fillStyle = '#01d8fe';
            ctx.textAlign = 'start';
            ctx.fillText(member.user.displayName, 400, 250, 550);
        }
        {
            ctx.font = 'bold 70px Sans';
            ctx.strokeStyle = '#050505';
            ctx.lineWidth = 4;
            ctx.strokeText(('(@' + member.user.username + ')').toString(), 400, 330, 550);
            ctx.fillStyle = '#01d8fe';
            ctx.textAlign = 'start';
            ctx.fillText(('(@' + member.user.username + ')').toString(), 400, 330, 550);
        }
        { // Member Count
            ctx.font = 'bold 30px Sans';
            ctx.fillStyle = '#8cfe01';
            ctx.textAlign = 'end';
            ctx.fillText((('Üye sayısı:' + member.guild.memberCount)).toString(), 970, 40, 550);
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
        await member.guild.systemChannel.send({ files: [attachment],content:`<@${member.user.id}>`});

        // await member.roles.add(autoRole.roleId);

    } catch (error) {
        console.log(`There was an ERROR in welcomeCard.js!: ${error}`)
    }
}