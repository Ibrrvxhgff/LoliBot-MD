import { db } from "../lib/postgres.js";

let handler = async (m, { command, text }) => {
let who = m.isGroup ? m.mentionedJid?.[0] : m.chat;
if (!who) return m.reply("⚠️ قم بعمل منشن لشخص باستخدام @tag");
let idFinal = who;

if (idFinal.includes("@lid")) {
const result = await db.query(`SELECT num FROM usuarios WHERE lid = $1`, [idFinal]);
if (!result.rowCount) return m.reply("❌ لم يتم العثور على المستخدم بهذا المعرف (LID) في قاعدة البيانات.");
const numero = result.rows[0].num;
idFinal = numero + "@s.whatsapp.net";
}

const cleanJid = idFinal.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
const cantidad = parseInt(text.match(/\d+/)?.[0]);
if (!cantidad || isNaN(cantidad)) return m.reply("⚠️ أدخل كمية صالحة");
try {
const res = await db.query(`SELECT id FROM usuarios WHERE id = $1`, [cleanJid]);
if (!res.rowCount) return m.reply("❌ هذا المستخدم غير مسجل في قاعدة البيانات.");
let resultado;

if (/addlimit|añadirdiamantes|dardiamantes/i.test(command)) {
resultado = await db.query(`UPDATE usuarios SET limite = limite + $1 WHERE id = $2 RETURNING limite`, [cantidad, cleanJid]);
return m.reply(`*≡ 💎 تمت إضافة الجواهر:*\n┏━━━━━━━━━━━━\n┃• *الإجمالي:* ${cantidad}\n┗━━━━━━━━━━━━`);
}

if (/removelimit|quitardiamantes|sacardiamantes/i.test(command)) {
resultado = await db.query(`UPDATE usuarios SET limite = GREATEST(0, limite - $1) WHERE id = $2 RETURNING limite`, [cantidad, cleanJid]);
return m.reply(`*≡ 💎 تمت إزالة الجواهر:*\n┏━━━━━━━━━━━━\n┃• *الإجمالي:* ${cantidad}\n┗━━━━━━━━━━━━`);
}

if (/addexp|añadirxp|addxp/i.test(command)) {
resultado = await db.query(`UPDATE usuarios SET exp = exp + $1 WHERE id = $2 RETURNING exp`, [cantidad, cleanJid]);
return m.reply(`*≡ ✨ تمت إضافة الخبرة:*\n┏━━━━━━━━━━━━\n┃• *الإجمالي:* ${cantidad}\n┗━━━━━━━━━━━━`);
}

if (/removexp|quitarxp|sacarexp/i.test(command)) {
resultado = await db.query(`UPDATE usuarios SET exp = GREATEST(0, exp - $1) WHERE id = $2 RETURNING exp`, [cantidad, cleanJid]);
return m.reply(`*≡ ✨ تمت إزالة الخبرة:*\n┏━━━━━━━━━━━━\n┃• *الإجمالي:* ${cantidad}\n┗━━━━━━━━━━━━`);
}
} catch (e) {
console.error(e);
return m.reply("❌ خطأ أثناء تعديل البيانات.");
}};
handler.help = ['addexp', 'addlimit', 'removexp', 'removelimit'];
handler.tags = ['owner'];
handler.command = /^(añadirdiamantes|dardiamantes|addlimit|removelimit|quitardiamantes|sacardiamantes|añadirxp|addexp|addxp|removexp|quitarxp|sacarexp)$/i;
handler.owner = true;
handler.register = true;

export default handler;
