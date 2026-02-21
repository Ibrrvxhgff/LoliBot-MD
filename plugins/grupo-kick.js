let handler = async (m, { conn, participants, usedPrefix, command }) => {
    const kickte = `*من الذي تريد طرده؟* قم بالإشارة إلى شخص ما باستخدام @tag أو قم بالرد على رسالته.`;
    if (!m.mentionedJid[0] && !m.quoted) {
        return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });
    }
    const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        await m.reply(`🗑️ تم طرد @${user.split('@')[0]} بنجاح.`, null, { mentions: [user] });
    } catch (e) {
        console.error(e);
        await m.reply('حدث خطأ أثناء محاولة طرد المستخدم. قد لا يكون البوت مشرفًا أو قد يكون المستخدم هو منشئ المجموعة.');
    }
};
handler.help = ['طرد @مستخدم'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar', 'طرد'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;
export default handler;
