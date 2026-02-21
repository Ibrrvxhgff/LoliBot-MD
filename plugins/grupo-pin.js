let handler = async (m, { conn, command }) => {
    const commandActions = {
        pin: 'تثبيتها',
        unpin: 'إلغاء تثبيتها',
        destacar: 'تمييزها',
        desmarcar: 'إلغاء تمييزها',
        تثبيت: 'تثبيتها',
        الغاء_التثبيت: 'إلغاء تثبيتها',
        تمييز: 'تمييزها',
        الغاء_التمييز: 'إلغاء تمييزها',
    };

    if (!m.quoted) return m.reply(`⚠️ قم بالرد على رسالة لـ ${commandActions[command] || 'تنفيذ الإجراء'}.`);

    try {
        const messageKey = m.quoted.key;
        const cmd = command.toLowerCase();

        if (cmd === 'pin' || cmd === 'تثبيت') {
            await conn.pinChatMessage(m.chat, messageKey, true); // Pin message
            m.react("📌");
        } else if (cmd === 'unpin' || cmd === 'الغاء_التثبيت') {
            await conn.pinChatMessage(m.chat, messageKey, false); // Unpin message
            m.react("✅");
        } else if (cmd === 'destacar' || cmd === 'تمييز') {
            // This 'keep' functionality seems to be a custom implementation. Preserving it.
            conn.sendMessage(m.chat, { keep: messageKey, type: 1, time: 15552000 });
            m.react("🌟");
        } else if (cmd === 'desmarcar' || cmd === 'الغاء_التمييز') {
            // This 'keep' functionality seems to be a custom implementation. Preserving it.
            conn.sendMessage(m.chat, { keep: messageKey, type: 2, time: 86400 });
            m.react("✅");
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ حدث خطأ. تأكد من أن البوت لديه صلاحيات المشرف وأنك ترد على رسالة صالحة.');
    }
};

handler.help = ['تثبيت', 'الغاء_التثبيت', 'تمييز', 'الغاء_التمييز'];
handler.tags = ['group'];
handler.command = ['pin', 'unpin', 'destacar', 'desmarcar', 'تثبيت', 'الغاء_التثبيت', 'تمييز', 'الغاء_التمييز'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;

export default handler;
