const handler = async (m, { conn }) => {
    try {
        const newLink = await conn.groupRevokeInvite(m.chat);
        const successMessage = `✅ *تمت إعادة تعيين رابط المجموعة بنجاح.*\n\n🔗 *الرابط الجديد:* https://chat.whatsapp.com/${newLink}`;
        await conn.reply(m.chat, successMessage, m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة إعادة تعيين الرابط. تأكد من أن البوت لديه صلاحيات المشرف.', m);
    }
};

handler.help = ['اعادة_تعيين_الرابط'];
handler.tags = ['group'];
handler.command = ['resetlink', 'revoke', 'اعادة_تعيين_الرابط'];
handler.botAdmin = true;
handler.admin = true;
handler.group = true;
handler.register = true;

export default handler;
