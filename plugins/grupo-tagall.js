let handler = async (m, { conn, text, participants }) => {
    try {
        const users = participants.map(p => p.id);
        const total = users.length;

        await m.react("📣");

        let message = "📢 *تنبيه للجميع في المجموعة* 🗣️\n\n";
        if (text && text.trim()) {
            message += `❏ *الرسالة:* ${text.trim()}\n`;
        }
        message += `*👥 أعضاء المجموعة:* ${total}\n`;
        message += `❏ *المنشن:*\n`;
        message += users.map(u => `➥ @${u.split('@')[0]}`).join("\n");

        await conn.sendMessage(m.chat, { text: message, mentions: users }, { quoted: m });
    } catch (e) {
        console.error("❌ خطأ في /tagall:", e);
        m.reply('حدث خطأ أثناء محاولة عمل منشن للجميع.');
    }
};

handler.help = ['منشن_الكل <رسالة>', 'للجميع <رسالة>'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|invocacion|todos|invocación|منشن_الكل|للجميع)$/i;
handler.admin = true;
handler.group = true;

export default handler;
