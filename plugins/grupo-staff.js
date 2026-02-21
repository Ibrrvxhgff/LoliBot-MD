let handler = async (m, { conn, text, participants }) => {
    try {
        if (!text || !text.trim()) {
            return m.reply('❓ يرجى كتابة رسالة ليتم إرسالها للمشرفين.\n*مثال: .المشرفين الرجاء الانتباه*');
        }

        const admins = participants.filter(p => p.admin).map(p => p.id);
        
        if (admins.length === 0) {
            return m.reply('⚠️ لا يوجد مشرفون في هذه المجموعة.');
        }

        await m.react("📣");

        const message = `•═══✪〘 *نداء للمشرفين* 〙✪═══•\n\n> *مطلوب حضور أحد المشرفين للأمر التالي:*\n\n*• الرسالة:* ${text.trim()}\n\n👑 *المشرفون (${admins.length}):*\n` + admins.map(id => `➥ @${id.split('@')[0]}`).join("\n");

        const footer = `\n\n> [ ⚠️ ] *يُستخدم هذا الأمر فقط عند الضرورة القصوى.*`;

        await conn.sendMessage(m.chat, { text: message + footer, mentions: admins }, { quoted: m });

    } catch (e) {
        console.error("❌ خطأ في /admins:", e);
        m.reply("حدث خطأ أثناء محاولة استدعاء المشرفين.");
    }
};

handler.help = ['المشرفين [رسالة]', 'الادمن [رسالة]'];
handler.tags = ['group'];
handler.command = ['staff', 'admins', 'listadmin', 'المشرفين', 'الادمن', 'الطاقم'];
handler.group = true;

export default handler;
