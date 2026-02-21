import { db } from '../lib/postgres.js';

let handler = async (m, { args }) => {
    const timeRange = (args[0] || '').trim();
    if (!/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(timeRange)) {
        return m.reply('التنسيق الصحيح: /تحديد_الوقت 23:00-06:00');
    }

    try {
        await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [m.chat]);
        await db.query(`UPDATE group_settings SET nsfw_horario = $1 WHERE group_id = $2`, [timeRange, m.chat]);
        m.reply(`⏰ تم تحديد وقت المحتوى غير المناسب إلى *${timeRange}*`);
    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء تحديد الوقت. حاول مرة أخرى.');
    }
};

handler.help = ['تحديد_الوقت 23:00-06:00'];
handler.tags = ['admin', 'group'];
handler.command = /^(sethorario|تحديد_الوقت)$/i;
handler.group = true;
handler.admin = true;

export default handler;
