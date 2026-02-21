import { createHash } from 'crypto';

const handler = async (m, { conn, usedPrefix }) => {
    const userResult = await m.db.query('SELECT serial_number, registered FROM usuarios WHERE id = $1', [m.sender]);
    const user = userResult.rows[0];

    if (!user || !user.registered) {
        return m.reply(`⚠️ *أنت غير مسجل بعد.*\nاستخدم الأمر \`${usedPrefix}تسجيل اسمك.عمرك\` للتسجيل.`);
    }

    const serialNumber = user.serial_number || createHash('md5').update(m.sender).digest('hex');

    // Ensure serial is saved if it was missing
    if (!user.serial_number) {
        await m.db.query('UPDATE usuarios SET serial_number = $1 WHERE id = $2', [serialNumber, m.sender]);
    }

    await conn.sendMessage(m.chat, { text: `🔑 *رقمك التسلسلي هو:*\n${serialNumber}` }, { quoted: m });
};

handler.help = ['رقمي'];
handler.tags = ['rpg'];
handler.command = /^(nserie|sn|myns|رقمي)$/i;

export default handler;
