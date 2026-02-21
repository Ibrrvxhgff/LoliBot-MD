let handler = async (m, { conn, args, text }) => {
    if (!text) {
        return m.reply('يرجى تقديم وصف جديد للمجموعة.\nمثال: .تغيير_الوصف أهلاً بكم في مجموعتنا');
    }

    try {
        await conn.groupUpdateDescription(m.chat, text);
        m.reply('✅ تم تحديث وصف المجموعة بنجاح.');
    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء تحديث الوصف. تأكد من أن البوت لديه صلاحيات المشرف.');
    }
};

handler.help = ['تغيير_الوصف <نص>'];
handler.tags = ['group'];
handler.command = /^setdesk|setdesc|newdesc|descripción|descripcion|تغيير_الوصف|الوصف$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
