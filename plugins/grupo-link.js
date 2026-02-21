import fs from 'fs';
const handler = async (m, {conn, args}) => {
    const group = m.chat;
    const groupName = (await conn.groupMetadata(group)).subject;
    const link = await conn.groupInviteCode(group);
    await conn.reply(m.chat, `🔗 *رابط مجموعة ${groupName}:*\n\nhttps://chat.whatsapp.com/${link}`, m);
};
handler.help = ['الرابط', 'رابط_المجموعة'];
handler.tags = ['group'];
handler.command = /^link(gro?up)?|الرابط|رابط_المجموعة$/i;
handler.group = true;
handler.botAdmin = true;
handler.register = true;
export default handler;
