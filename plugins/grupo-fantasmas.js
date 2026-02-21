import { db } from '../lib/postgres.js';

let handler = async (m, { conn, text, participants, args, command, metadata }) => {
try {
const result = await db.query(`SELECT user_id, message_count
      FROM messages
      WHERE group_id = $1`, [m.chat]);
let memberData = participants.map(mem => {
const userId = mem.id;
const userData = result.rows.find(row => row.user_id === userId) || { message_count: 0 };
return { id: userId,
messages: userData.message_count,
isAdmin: mem.admin === 'admin' || mem.admin === 'superadmin'
}});

let sum = text ? parseInt(text) : memberData.length;
if (isNaN(sum) || sum <= 0) sum = memberData.length;
let sider = memberData.slice(0, sum).filter(mem => mem.messages === 0 && !mem.isAdmin);
let total = sider.length;

switch (command.toLowerCase()) {
case 'fantasmas': case 'الاصنام':
if (total === 0) return m.reply(`⚠️ هذه المجموعة نشطة، لا يوجد بها أصنام! :D`);
let teks = `⚠️ *مراجعة الأعضاء غير النشطين* ⚠️\n\n`;
teks += `*المجموعة:* ${metadata.subject || 'بدون اسم'}\n`;
teks += `*أعضاء المجموعة:* ${memberData.length}\n`;
teks += `*الأعضاء غير النشطين:* ${total}\n\n`;
teks += `[ 👻 *قائمة الأصنام* 👻 ]\n`;
teks += sider.map(v => `  👈🏻 @${v.id.split('@')[0]}`).join('\n');
teks += `\n\n*ملاحظة:* قد لا تكون هذه القائمة دقيقة 100%. يبدأ البوت في حساب الرسائل منذ تفعيله في هذه المجموعة.`;
await conn.sendMessage(m.chat, { text: teks, contextInfo: { mentionedJid: sider.map(v => v.id)}}, { quoted: m });
break;

case 'kickfantasmas': case 'طرد_الاصنام':
if (total === 0) return m.reply(`⚠️ هذه المجموعة نشطة، لا يوجد بها أصنام! :D`);
let kickTeks = `⚠️ *حذف الأعضاء غير النشطين* ⚠️\n\n`;
kickTeks += `*المجموعة:* ${metadata.subject || 'بدون اسم'}\n`;
kickTeks += `*أعضاء المجموعة:* ${memberData.length}\n`;
kickTeks += `*الأعضاء غير النشطين:* ${total}\n\n`;
kickTeks += `[ 👻 *الأصنام الذين سيتم حذفهم* 👻 ]\n`;
kickTeks += sider.map(v => `@${v.id.split('@')[0]}`).join('\n');
kickTeks += `\n\n*سيقوم البوت بحذف القائمة المذكورة، بدءًا من 20 ثانية، مع 10 ثوانٍ بين كل عملية طرد.*`;
await conn.sendMessage(m.chat, { text: kickTeks, contextInfo: { mentionedJid: sider.map(v => v.id) }}, { quoted: m });

let chatSettings = (await db.query("SELECT * FROM group_settings WHERE group_id = $1", [m.chat])).rows[0] || {};
let originalWelcome = chatSettings.welcome !== undefined ? chatSettings.welcome : true;
await db.query(`INSERT INTO group_settings (group_id, welcome) VALUES ($1, false) ON CONFLICT (group_id) DO UPDATE SET welcome = false`, [m.chat]);
await delay(20000); 
try {
for (let user of sider) {
if (user.id !== conn.user.jid) { 
await conn.groupParticipantsUpdate(m.chat, [user.id], 'remove');
await delay(10000); 
}}} finally {
await db.query(`UPDATE group_settings SET welcome = $1 WHERE group_id = $2`, [originalWelcome, m.chat]);
}
await m.reply(`✅ اكتمل حذف الأصنام.`);
break;
}
} catch (err) {
console.error(err);
m.reply("❌ حدث خطأ أثناء تنفيذ الأمر. يرجى المحاولة مرة أخرى.");
}}; 
handler.help = ['الاصنام', 'طرد_الاصنام'];
handler.tags = ['group'];
handler.command = /^(fantasmas|kickfantasmas|الاصنام|طرد_الاصنام)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true; 
handler.register = true;

export default handler;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));