let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('يرجى تقديم اسم جديد للمجموعة.\nمثال: .تغيير_الاسم اسم المجموعة الجديد');
    }

    try {
        await conn.groupUpdateSubject(m.chat, text);
        m.reply('✅ تم تحديث اسم المجموعة بنجاح.');
    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء تحديث الاسم. تأكد من أن البوت لديه صلاحيات المشرف وأن الاسم لا يتجاوز 25 حرفًا.');
    }
};

handler.help = ['تغيير_الاسم <نص>'];
handler.tags = ['group'];
handler.command = /^(setname|newnombre|nuevonombre|تغيير_الاسم|الاسم)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
