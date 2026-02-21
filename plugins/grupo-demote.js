const handler = async (m, {conn, usedPrefix, text}) => {
if (isNaN(text) && !text.match(/@/g)) {
} else if (isNaN(text)) {
var number = text.split`@`[1];
} else if (!isNaN(text)) {
var number = text;
}

if (!text && !m.quoted) return conn.reply(m.chat, `*⚠️ من الذي تريد تخفيض رتبته؟* قم بالإشارة إلى شخص ما أو الرد على رسالته.`, m);
if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) return conn.reply(m.chat, `*⚠️ الرقم الذي أدخلته غير صحيح*. يرجى إدخال الرقم الصحيح أو من الأفضل الإشارة إلى المستخدم.`, m);
try {
let user;
if (text) {
user = number + '@s.whatsapp.net';
} else if (m.quoted?.sender) {
user = m.quoted.sender;
} else if (m.mentionedJid) {
user = m.mentionedJid[0];
}
if (user) {
await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
conn.reply(m.chat, `✅ لم يعد @${user.split('@')[0]} مشرفًا.`, m, { mentions: [user] });
}
} catch (e) {
console.error(e);
conn.reply(m.chat, 'حدث خطأ أثناء محاولة تخفيض رتبة المستخدم.', m);
}};
handler.help = ['*+966...*', '*@مستخدم*', '*بالرد على رسالة*'].map((v) => 'تخفيض ' + v);
handler.tags = ['group'];
handler.command = /^(demote|quitarpoder|quitaradmin|تخفيض|تنزيل_مشرف)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = true;
handler.fail = null;
export default handler;
