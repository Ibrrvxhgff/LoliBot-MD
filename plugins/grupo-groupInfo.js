import { db } from '../lib/postgres.js'

let handler = async (m, { conn }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => "https://telegra.ph/file/39fb047cdf23c790e0146.jpg")

let groupMetadata
try {
groupMetadata = await conn.groupMetadata(m.chat)
} catch {
return m.reply('*⚠️ خطأ في الحصول على معلومات المجموعة. يرجى المحاولة مرة أخرى لاحقًا.*')
}
const participants = groupMetadata.participants || []
const groupAdmins = participants.filter(p => p.admin)
const usarLid = participants.some(p => p.id?.endsWith?.('@lid'))
const listAdmin = await Promise.all(groupAdmins.map(async (v, i) => {
let numero = null
if (usarLid && v.id.endsWith('@lid')) {
const res = await db.query('SELECT num FROM usuarios WHERE lid = $1', [v.id])
numero = res.rows[0]?.num || null
} else if (/^\d+@s\.whatsapp\.net$/.test(v.id)) {
numero = v.id.split('@')[0]
}
return `➥ ${numero ? `@${numero}` : `@المستخدمون`}`
}))

const { rows } = await db.query(`SELECT * FROM group_settings WHERE group_id = $1`, [m.chat])
const data = rows[0] || {}
const { welcome, detect, antifake, antilink, modoadmin, primary_bot, modohorny, nsfw_horario, banned } = data
const fallbackOwner = m.chat.includes('-') ? m.chat.split('-')[0] + '@s.whatsapp.net' : null
const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || fallbackOwner || "غير معروف"

let primaryBotMention = ''
if (primary_bot) {
const allBots = [conn, ...global.conns.filter(bot => bot.user && bot.ws?.socket?.readyState !== 3)]
const selectedBot = allBots.find(bot => bot.user.jid === primary_bot)
primaryBotMention = `@${primary_bot.split('@')[0]}`
}

const text = `『 *معلومات المجموعة* 』

*• المعرف:*
${groupMetadata.id}

*• الاسم:*
${groupMetadata.subject}

*• الأعضاء:*
${participants.length}

*• منشئ المجموعة:*
@${owner.split('@')[0]}

*• المشرفون:*
${listAdmin.join('\n')}

*• إعدادات المجموعة:*
• البوت: ${modoadmin ? 'مطفأ 📴' : `${primaryBotMention || 'متصل ✅'}`}
• الترحيب: ${welcome ? '✅' : '❌'}
• مضاد الروابط: ${antilink ? '✅' : '❌'}
• مضاد الأرقام الوهمية: ${antifake ? '✅' : '❌'}
• الكشف: ${detect ? '✅' : '❌'}
• وضع +18: ${modohorny ? '✅' : '❌'}
• وقت السماح بـ NSFW: ${nsfw_horario ? `🕒 (${nsfw_horario})` : '❌'}
• المجموعة محظورة: ${banned ? '🚫 نعم' : '✅ لا'}
`.trim()
await conn.sendFile(m.chat, pp, 'pp.jpg', text, m, { mentions: [owner, ...listAdmin.map(a => a.match(/@(\d+)/)?.[1] + '@s.whatsapp.net').filter(Boolean)] })
}
handler.help = ['معلومات_المجموعة']
handler.tags = ['group']
handler.command = ['infogrupo', 'groupinfo', 'infogp', 'معلومات_المجموعة', 'معلومات_الجروب']
handler.group = true
handler.register = true

export default handler
