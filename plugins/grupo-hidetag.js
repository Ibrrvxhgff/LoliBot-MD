import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
import fs from 'fs';

const handler = async (m, { conn, text, participants, isOwner, usedPrefix, command, isAdmin }) => {
    if (!m.quoted && !text) return m.reply(`⚠️ أرسل نصًا أو قم بالرد على رسالة لتوجيه إشعار مخفي للجميع.`);
    let users = participants.map(u => conn.decodeJid(u.id));

    let messageText = '';
    if (text) {
        messageText = text;
    } else if (m.quoted?.message) {
        const msg = m.quoted.message;
        messageText = msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption || '';
    }

    if (m.quoted && m.quoted.message) {
        const type = Object.keys(m.quoted.message)[0];
        const isMedia = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type);
        if (isMedia) {
            try {
                let mediax = await m.quoted.download();
                let msg = { contextInfo: { mentionedJid: users } };
                if (type === 'imageMessage') {
                    msg.image = mediax;
                    if (messageText) msg.caption = messageText;
                } else if (type === 'videoMessage') {
                    msg.video = mediax;
                    if (messageText) msg.caption = messageText;
                } else if (type === 'audioMessage') {
                    msg.audio = mediax;
                    msg.ptt = true;
                    msg.fileName = 'Hidetag.mp3';
                    msg.mimetype = 'audio/mp4';
                } else if (type === 'stickerMessage') {
                    msg.sticker = mediax;
                } else if (type === 'documentMessage') {
                    msg.document = mediax;
                    msg.fileName = m.quoted.fileName || 'ملف';
                    msg.mimetype = m.quoted.mimetype || 'application/octet-stream';
                }
                await conn.sendMessage(m.chat, msg, { quoted: null });
                return;
            } catch (e) {
                console.error(e);
                // Fallback to text message if media download fails
                await conn.sendMessage(m.chat, { text: messageText, contextInfo: { mentionedJid: users } }, { quoted: null });
            }
        }
    }

    // Send text only if no media was handled
    try {
        await conn.sendMessage(m.chat, { text: messageText, contextInfo: { mentionedJid: users } }, { quoted: null });
    } catch (e) {
        console.error(e);
    }
};
handler.help = ['تاغ_مخفي (نص أو رد)'];
handler.tags = ['group'];
handler.command = /^(hidetag|notificar|notify|تاغ_مخفي|اشعار|تنبيه)$/i;
handler.group = true;
handler.admin = true;
handler.register = true; 
export default handler;