import { db } from '../lib/postgres.js';

let handler = async (m, { conn, participants, metadata }) => {
    try {
        const result = await db.query(`SELECT user_id, message_count FROM messages WHERE group_id = $1`, [m.chat]);
        
        let memberData = participants.map(mem => {
            const userId = mem.id;
            const userData = result.rows.find(row => row.user_id === userId) || { message_count: 0 };
            return { id: userId, messages: userData.message_count };
        });

        memberData.sort((a, b) => b.messages - a.messages);

        let activeCount = memberData.filter(mem => mem.messages > 0).length;
        let inactiveCount = memberData.length - activeCount;

        let teks = `*📊 نشاط المجموعة 📊*\n\n`;
        teks += `□ *المجموعة:* ${metadata.subject || 'بدون اسم'}\n`;
        teks += `□ *إجمالي الأعضاء:* ${participants.length}\n`;
        teks += `□ *الأعضاء النشطون:* ${activeCount}\n`;
        teks += `□ *الأعضاء غير النشطين:* ${inactiveCount}\n\n`;
        teks += `*□ قائمة الأعضاء حسب النشاط:*\n`;

        const mentions = [];
        for (let mem of memberData) {
            const numero = mem.id.split('@')[0];
            if (numero) {
                teks += `➥ @${numero} - الرسائل: ${mem.messages}\n`;
                mentions.push(mem.id);
            }
        }

        await conn.sendMessage(m.chat, { text: teks, mentions }, { quoted: m });
    } catch (e) {
        console.error("❌ خطأ في /activity:", e);
        m.reply('حدث خطأ أثناء جلب نشاط المجموعة.');
    }
};

handler.help = ['نشاط_المجموعة'];
handler.tags = ['group'];
handler.command = /^(contador|نشاط_المجموعة|النشاط)$/i;
handler.admin = true;
handler.group = true;

export default handler;
