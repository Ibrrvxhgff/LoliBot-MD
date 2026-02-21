const handler = async (m, { conn, usedPrefix, text }) => {
    const usageMessage = `*من تريد ترقيته؟*\nقم بالإشارة إلى شخص ما باستخدام @tag أو قم بالرد على رسالته.`;
    const invalidNumberMessage = `*⚠️ الرقم الذي أدخلته غير صحيح.* يرجى إدخال رقم صحيح أو الإشارة إلى المستخدم.`;

    let user;
    if (m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else {
        const number = text.replace(/[^0-9]/g, '');
        if (!number) return conn.reply(m.chat, usageMessage, m);
        if (number.length < 9) return conn.reply(m.chat, invalidNumberMessage, m);
        user = `${number}@s.whatsapp.net`;
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        const successMessage = `✅ تم ترقية @${user.split('@')[0]} إلى مشرف بنجاح.`;
        await conn.reply(m.chat, successMessage, m, {
            mentions: [user]
        });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '❌ حدث خطأ أثناء محاولة ترقية المستخدم. قد يكون المستخدم مشرفًا بالفعل أو قد لا يمتلك البوت صلاحيات كافية.', m);
    }
};

handler.help = ['ترقية @مستخدم', 'ترقية (رد)'];
handler.tags = ['group'];
handler.command = /^(promote|daradmin|darpoder|ترقية|مشرف)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = true;

export default handler;
