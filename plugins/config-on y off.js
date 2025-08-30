import { db } from '../lib/postgres.js'
import { getSubbotConfig } from '../lib/postgres.js'

const handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
const isEnable = /true|enable|(turn)?on|1/i.test(command)
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
menu += `● *مفتاح الإعدادات:*\n`;
menu += `✅ ⇢ *الميزة مفعلة*\n`;
menu += `❌ ⇢ *الميزة معطلة*\n`;
menu += `⚠️ ⇢ *هذه الدردشة ليست مجموعة*\n\n`;
menu += `*『 وظائف للمشرفين 』*\n\n`;
menu += `🎉 الترحيب ${getStatus('welcome')}\n• رسالة ترحيب عند دخول عضو جديد\n• ${usedPrefix + command} welcome\n\n`;
menu += `📣 كاشف التغييرات ${getStatus('detect')}\n• إشعار عند حدوث تغييرات في المجموعة\n• ${usedPrefix + command} detect\n\n`;
menu += `🔗 مانع الروابط ${getStatus('antilink')}\n• كشف روابط المجموعات الأخرى\n• ${usedPrefix + command} antilink\n\n`;
menu += `🌐 مانع الروابط 2 ${getStatus('antilink2')}\n• كشف أي نوع من الروابط\n• ${usedPrefix + command} antilink2\n\n`;
menu += `🕵️ مانع الأرقام المزيفة ${getStatus('antifake')}\n• حظر الأرقام من دول معينة\n• ${usedPrefix + command} antifake\n\n`;
menu += `🔞 وضع NSFW ${getStatus('modohorny')}\n• السماح بمحتوى +18 في الملصقات/الصور المتحركة\n• ${usedPrefix + command} modohorny\n\n`
menu += `🔒 وضع المشرفين فقط ${getStatus('modoadmin')}\n• المشرفون فقط يمكنهم استخدام الأوامر\n• ${usedPrefix + command} modoadmin\n\n`;
  
menu += `\n*『 وظائف للمالك 』*\n\n`;
menu += `🚫 مانع الخاص ${isSubbot ? (getSubbotConfig(botId).antiPrivate ? '✅' : '❌') : '⚠️'}
• حظر استخدام البوت في الخاص
• ${usedPrefix + command} antiprivate\n\n`;
menu += `📵 مانع الاتصال ${isSubbot ? (getSubbotConfig(botId).anticall ? '✅' : '❌') : '⚠️'}
• حظر المكالمات
• ${usedPrefix + command} anticall`;
  
switch (type) {
case 'welcome': case 'bienvenida':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET welcome = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'detect': case 'avisos':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET detect = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antilink': case 'antienlace':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink = $1 WHERE group_id = $2`, [isEnable, chatId])
break
      
case 'antilink2':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antilink2 = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'antiporn': case 'antiporno': case 'antinwfs':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antiporn = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'audios':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET audios = $1 WHERE group_id = $2`, [isEnable, chatId])
break
            
case 'antifake':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET antifake = $1 WHERE group_id = $2`, [isEnable, chatId])
break
    
case 'nsfw': case "modohorny": case "modocaliente":
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
  await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
  await db.query(`UPDATE group_settings SET modohorny = $1 WHERE group_id = $2`, [isEnable, chatId])
  break
      
case 'modoadmin': case 'onlyadmin':
if (!m.isGroup) throw '⚠️ هذا الأمر يمكن استخدامه فقط داخل المجموعات.'
if (!isAdmin) throw "⚠️ المشرفون فقط يمكنهم استخدام هذا الأمر.";
await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [chatId])
await db.query(`UPDATE group_settings SET modoadmin = $1 WHERE group_id = $2`, [isEnable, chatId])
break

case 'antiprivate': case 'antiprivado':
if (!isSubbot && !isOwner) return m.reply('❌ المالك أو البوتات الفرعية فقط يمكنهم تغيير هذا.');
await db.query(`INSERT INTO subbots (id, anti_private)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_private = $2`, [cleanId, isEnable]);
isAll = true;
break;

case 'anticall': case 'antillamada':
if (!isSubbot && !isOwner) return m.reply('❌ المالك أو البوتات الفرعية فقط يمكنهم تغيير هذا.');
await db.query(`INSERT INTO subbots (id, anti_call)
    VALUES ($1, $2)
    ON CONFLICT (id) DO UPDATE SET anti_call = $2`, [cleanId, isEnable]);
isAll = true;
break;
default:
return m.reply(menu.trim());
}
await m.reply(`🗂️ الخيار *${type}* ${isAll ? 'للبوت بأكمله' : isUser ? 'لهذا المستخدم' : 'لهذه الدردشة'} تم *${isEnable ? 'تفعيله' : 'تعطيله'}* بنجاح.`)
}
handler.help = ['enable <opción>', 'disable <opción>']
handler.tags = ['nable']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i
handler.register = true
//handler.group = true 
//handler.admin = true
export default handler
