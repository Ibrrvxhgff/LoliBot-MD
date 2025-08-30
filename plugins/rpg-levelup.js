import { canLevelUp, xpRange } from '../lib/levelling.js'
import { getRole } from './_autolevelup.js'
import axios from 'axios'

const multiplier = 650

let handler = async (m, { conn }) => {
const name = m.pushName
const res = await m.db.query('SELECT exp, level, role, money FROM usuarios WHERE id = $1', [m.sender])
let user = res.rows[0]
const { exp, level, role, money } = user

if (!canLevelUp(level, exp, multiplier)) {
const { min, xp, max } = xpRange(level, multiplier)
return m.reply(`『 *إحصائياتك 🆙* 』

إحصائياتك في الوقت الفعلي 🕐

├─ ❏ *الاسم:* ${name}
├─ ❏ *الخبرة 🆙:* ${exp - min}/${xp}
├─ ❏ *المستوى:* ${level}
└─ ❏ *الرتبة:* ${role}

> ينقصك *${max - exp}* من *الخبرة* للارتقاء للمستوى التالي`)
}

const before = level
let newLevel = level
while (canLevelUp(newLevel, exp, multiplier)) newLevel++
const newRole = getRole(newLevel).name
await m.db.query('UPDATE usuarios SET level = $1, role = $2 WHERE id = $3', [newLevel, newRole, m.sender])

const teks = `🎊 تهانينا ${name} لقد وصلت إلى مستوى جديد:`
const str = `*[ 𝐋𝐄𝐕𝐄𝐋 𝐔𝐏 ]*
      
*• المستوى السابق:* ${before}
*• المستوى الحالي:* ${newLevel}
*• الرتبة:* ${newRole}

> _*كلما تفاعلت مع البوتات، ارتفع مستواك*_`

try {
const apiURL = `${info.apis}/canvas/balcard?url=${encodeURIComponent(m.pp)}&background=https://telegra.ph/file/66c5ede2293ccf9e53efa.jpg&username=${encodeURIComponent(name)}&discriminator=${m.sender.replace(/[^0-9]/g, '')}&money=${money}&xp=${exp}&level=${newLevel}`
const result = await axios.get(apiURL, { responseType: 'arraybuffer' })
const buffer = Buffer.from(result.data)
await conn.sendFile(m.chat, buffer, 'levelup.jpg', str, m)
} catch {
await conn.fakeReply(m.chat, str, '13135550002@s.whatsapp.net', `*إحصائياتك 🆙*`, 'status@broadcast')
}}
handler.help = ['nivel', 'levelup']
handler.tags = ['econ']
handler.command = ['nivel', 'لفل', 'levelup', 'level']
handler.register = true

export default handler
