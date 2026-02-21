import { db } from '../lib/postgres.js';

let handler = async (m, { conn, args, usedPrefix, command, metadata }) => {
try {
let who;
if (m.isGroup) {
who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
} else {
who = m.chat;
}

if (!who) return m.reply(`*من الذي تريد إزالة تحذير منه؟* قم بالإشارة إلى شخص ما باستخدام @tag أو قم بالرد على رسالته!`)
const userResult = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [who]);
if (!userResult.rows.length) return m.reply(`*من الذي تريد إزالة تحذير منه؟* قم بالإشارة إلى شخص ما باستخدام @tag أو قم بالرد على رسالته!`)
let warn = userResult.rows[0].warn || 0;

if (warn > 0) {
await db.query(`UPDATE usuarios
        SET warn = warn - 1
        WHERE id = $1`, [who]);
warn -= 1; 
await conn.reply(m.chat, `*⚠️ تم إزالة تحذير واحد ⚠️*\n\nالمستخدم: @${who.split`@`[0]}\n*• التحذيرات:* -1\n*• الإجمالي:* ${warn}`, m, { mentions: [who] })
} else {
await conn.reply(m.chat, `*⚠️ المستخدم @${who.split`@`[0]} ليس لديه أي تحذيرات.*`, m, { mentions: [who] })
}} catch (err) {
console.error(err);
}};
handler.help = ['ازالة_تحذير @مستخدم', 'الغاء_تحذير @مستخدم'];
handler.tags = ['group'];
handler.command = /^(delwarn|unwarn|ازالة_تحذير|الغاء_تحذير)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = true;

export default handler;