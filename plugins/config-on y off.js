import { db } from '../lib/postgres.js'
import { getSubbotConfig } from '../lib/postgres.js'

const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
const isEnable = /true|enable|(turn)?on|1|تفعيل/i.test(command)
const type = (args[0] || '').toLowerCase()
const chatId = m.chat
const botId = conn.user?.id
const cleanId = botId.replace(/:\d+/, '');
const isSubbot = botId !== 'main'
let isAll = false, isUser = false
let res = await db.query('SELECT * FROM group_settings WHERE group_id = $1', [chatId]);
let chat = res.rows[0] || {};
const getStatus = (flag) => m.isGroup ? (chat[flag] ? '✅' : '❌') : '⚠️';

let menu = `*『 ⧼⧼⧼ الإعدادات ⧽⧽⧽ 』*\n\n`;
menu += `> *اختر خيارًا من القائمة*\n> *لبدء الإعداد*\n\n`;
menu += `● *تنبيهات الإعدادات:*\n✅ ⇠ *الميزة مفعلة*\n❌ ⇠ *الميزة معطلة*\n⚠️ ⇠ *هذه الدردشة ليست مجموعة*\n\n`;
menu += `*『 ميزات للمشرفين 』*\n\n`;
menu += `🎉 الترحيب ${getStatus('welcome')}\n• رسالة ترحيب\n• ${usedPrefix}${command} الترحيب\n\n`;
menu += `📣 التنبيهات ${getStatus('detect')}\n• إشعار بتغييرات المجموعة\n• ${usedPrefix}${command} التنبيهات\n\n`;
menu += `🔗 مانع_الروابط ${getStatus('antilink')}\n• كشف روابط المجموعات\n• ${usedPrefix}${command} مانع_الروابط\n\n`;
menu += `🌐 مانع_الروابط2 ${getStatus('antilink2')}\n• كشف أي رابط\n• ${usedPrefix}${command} مانع_الروابط2\n\n`;
menu += `🕵️ مانع_الأرقام_المزيفة ${getStatus('antifake')}\n• حظر أرقام من دول أخرى\n• ${usedPrefix}${command} مانع_الأرقام_المزيفة\n\n`;
menu += `🔞 وضع_إباحي ${getStatus('modohorny')}\n• محتوى +18 في الملصقات/الصور المتحركة\n• ${usedPrefix}${command} وضع_إباحي\n\n`;
menu += `🔒 وضع_المشرفين ${getStatus('modoadmin')}\n• المشرفون فقط يمكنهم استخدام الأوامر\n• ${usedPrefix}${command} وضع_المشرفين\n\n`;

menu += `\n*『 ميزات للمالك 』*\n\n`;
menu += `🚫 مانع_الخاص ${isSubbot ? (getSubbotConfig(botId).antiPrivate ? '✅' : '❌') : '⚠️'}\n• حظر الاستخدام في الخاص\n• ${usedPrefix}${command} مانع_الخاص\n\n`;
menu += `📵 مانع_الاتصال ${isSubbot ? (getSubbotConfig(botId).anticall ? '✅' : '❌') : '⚠️'}\n• حظر المكالمات\n• ${usedPrefix}${command} مانع_الاتصال`;

switch (type) {
case 'welcome': case 'bienvenida': case 'الترحيب':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET welcome = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'detect': case 'avisos': case 'التنبيهات':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET detect = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antilink': case 'antienlace': case 'مانع_الروابط':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antilink2': case 'مانع_الروابط2':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink2 = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antiporn': case 'antiporno': case 'antinwfs': case 'مانع_الإباحية':
if (!m.is_group) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antiporn = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'audios': case 'الصوتيات':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET audios = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antifake': case 'مانع_الأرقام_المزيفة':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antifake = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'nsfw': case "modohorny": case "modocaliente": case 'وضع_إباحي':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
  await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
  await db.query(`UPDATE group_settings SET modohorny = $1 WHERE group_id = $2`, [isEnable, chatId])
  break

case 'modoadmin': case 'onlyadmin': case 'وضع_المشرفين':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه داخل المجموعات فقط.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET modoadmin = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antiprivate': case 'antiprivado': case 'مانع_الخاص':
if (!isSubbot && !isOwner) return m.reply('❌ المالك أو البوتات الفرعية فقط يمكنهم تغيير هذا.');
await db.query(`INSERT INTO subbots (id, anti_private)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_private = $2`, [cleanId, isEnable]);
isAll = true;
break;

case 'anticall': case 'antillamada': case 'مانع_الاتصال':
if (!isSubbot && !isOwner) return m.reply('❌ المالك أو البوتات الفرعية فقط يمكنهم تغيير هذا.');
await db.query(`INSERT INTO subbots (id, anti_call)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_call = $2`, [cleanId, isEnable]);
isAll = true;
break;
default:
return m.reply(menu.trim());
}
await m.reply(`🗂️ الخيار *${type}* لـ ${isAll ? 'البوت بأكمله' : isUser ? 'هذا المستخدم' : 'هذه الدردشة'} تم *${isEnable ? 'تفعيله' : 'تعطيله'}* بنجاح.`)
}
handler.help = ['enable <opción>', 'disable <opción>']
handler.tags = ['nable']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01]|تفعيل|تعطيل)$/i
handler.register = true

export default handler
