import { db } from '../lib/postgres.js';

const maxwarn = 3;
let handler = async (m, { conn, participants, metadata }) => {
    try {
        const result = await db.query(`SELECT id, warn FROM usuarios WHERE warn > 0`);
        const participantIds = participants.map(p => p.id);
        const warnedUsers = result.rows
            .filter(user => participantIds.includes(user.id))
            .map(user => ({ id: user.id, warn: user.warn }));

        warnedUsers.sort((a, b) => b.warn - a.warn);

        let teks = `*📋 قائمة التحذيرات 📋*\n\n`;
        teks += `*المجموعة:* ${metadata.subject || 'بدون اسم'}\n`;
        teks += `*إجمالي المستخدمين المحذرين:* ${warnedUsers.length}\n\n`;

        if (warnedUsers.length === 0) {
            teks += `*لا يوجد مستخدمون لديهم تحذيرات في هذه المجموعة! 😊*`;
        } else {
            teks += `*المستخدمون المحذرون:*\n`;
            for (let user of warnedUsers) {
                teks += `➥ @${user.id.split('@')[0]} - التحذيرات: ${user.warn}/${maxwarn}\n`;
            }
        }

        await conn.reply(m.chat, teks, m, { mentions: warnedUsers.map(user => user.id) });
    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, 'حدث خطأ أثناء جلب قائمة التحذيرات.', m);
    }
};

handler.help = ['قائمة_التحذيرات'];
handler.tags = ['group'];
handler.command = /^listwarn|قائمة_التحذيرات$/i;
handler.group = true;
handler.admin = true;
handler.register = true;

export default handler;
