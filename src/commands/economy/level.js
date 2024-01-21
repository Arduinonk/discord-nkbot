const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');
const { createCanvas, loadImage } = require('canvas');
const calculateLevelXp = require('../../utils/calculateLevelXp');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply(`You can run this command inside a server!`);
            return;
        }

        await interaction.deferReply(
            {
                ephemeral: true
            });

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);
        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more!` : `You don't have any levels yet. Chat a little more and try again!`
            );
            return;
        }
        let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
            '-_id userId level xp'
        );

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        const xpOfLevel = calculateLevelXp(fetchedLevel.level);

        const canvas = createCanvas(1000, 300);
        const ctx = canvas.getContext('2d');
        const background = await loadImage('https://raw.githubusercontent.com/Arduinonk/nk90miner/main/138_150.png');
        const avatar = await loadImage(targetUserObj.user.avatarURL({ extension: 'png' }));
        const bar_width = 6;

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        { // UserName
            ctx.font = 'bold 40px Sans';
            ctx.fillStyle = '#fefa01';
            ctx.textAlign = 'start';
            ctx.fillText((targetUserObj.user.displayName + '(@' + targetUserObj.user.username + ')').toString(), 339, 179, 250);
        }
        { // ServerName
            ctx.font = '25px Sans';
            ctx.fillStyle = '#fe01ae';
            ctx.textAlign = 'end';
            ctx.fillText(('Sunucu:' + targetUserObj.guild.name + '. Üye sayısı:' + targetUserObj.guild.memberCount).toString(), 970, 280, 250);
        }
        { // StatusColor
            ctx.beginPath();
            ctx.arc(137, 149, 110, 0, 2 * Math.PI);
            ctx.lineWidth = 10;
            if (!targetUserObj.presence) {
                ctx.strokeStyle = '#4d4d4d';
            } else {

                if (targetUserObj.presence.status === 'online') {
                    ctx.strokeStyle = '#00ff00';
                }
                if (targetUserObj.presence.status === 'idle') {
                    ctx.strokeStyle = '#ffff00';
                }
                if (targetUserObj.presence.status === 'dnd') {
                    ctx.strokeStyle = '#ff0000';
                }
            }
            ctx.stroke();
            ctx.closePath();
        }
        { // ProgressBar Bg
            ctx.strokeStyle = '#000000';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 50;
            ctx.strokeRect(339, 219, bar_width * 100, 2);
        }
        { // white filling bar
            ctx.strokeStyle = '#e0e0de';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 46;
            if (xpOfLevel <= 1) {
                ctx.strokeRect(340, 219, 100 * bar_width, 2);
            } else {
                ctx.strokeRect(340, 219, (fetchedLevel.xp * 100 / xpOfLevel) * bar_width, 2);
            }

        }
        { // 11/100XP
            ctx.font = 'Sans Not-Rotated 36px';
            ctx.fillStyle = '#0073ff';
            ctx.textAlign = 'end';
            let text = ''
            if (xpOfLevel <= 1) {
                text = (fetchedLevel.xp + '/' + fetchedLevel.xp + 'XP').toString()
            } else {
                text = (fetchedLevel.xp + '/' + xpOfLevel + 'XP').toString()
            }
            ctx.fillText(text, 939, 233, 250);
        }
        { // x. Seviye
            ctx.font = 'bold 60px Sans';
            ctx.fillStyle = '#aa55ff';
            ctx.textAlign = 'end';
            const levelText = (fetchedLevel.level + '.Seviye').toString()
            ctx.fillText(levelText, 970, 70, 250);
        }
        { // Rank#X
            ctx.font = 'bold 60px Sans';
            ctx.fillStyle = '#18c1ff';
            ctx.textAlign = 'start';
            const levelText = ('Rank#' + currentRank).toString()
            ctx.fillText(levelText, 350, 70, 250);
        }
        { // Draw Avatar
            ctx.beginPath();
            ctx.arc(137, 149, 110, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 27, 39, 220, 220);
        }

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'image.png' });
        const embed = new EmbedBuilder().setImage(`attachment://${attachment.name}`)
        interaction.editReply({ files: [attachment] })

    },

    name: 'level',
    description: 'Show your/someone\'s level.',
    // devOnly: true,
    // testOnly: true,
    // deleted: true,
    options: [
        {
            name: 'target-user',
            description: 'The user whose level you want to see.',
            type: ApplicationCommandOptionType.Mentionable
        }
    ]
}
