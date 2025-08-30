import fetch from 'node-fetch'
import axios from 'axios'
import hispamemes from 'hispamemes'
import { db } from '../lib/postgres.js'

const contenido = {
  waifu: { label: '*💖 زوجتي الخيالية 💖*', api: 'waifu', nsfwApi: 'waifu', type: 'api', aliases: [] },
  neko: { label: '🐱 فتاة القطة', api: 'neko', nsfwApi: 'neko', type: 'api', aliases: ['قطة', 'nyan'] },
  shinobu: { label: '🍡 شينوبو', api: 'shinobu', type: 'api', aliases: [] },
  megumin: { label: '💥 ميجومين', api: 'megumin', type: 'api', aliases: ['meg'] },
  bully: { label: '😈 تنمر', api: 'bully', type: 'api', aliases: [] },
  cuddle: { label: '🥰 عناق', api: 'cuddle', type: 'api', aliases: [] },
  cry: { label: '😭 بكاء', api: 'cry', type: 'api', aliases: [] },
  bonk: { label: '🔨 ضربة', api: 'bonk', type: 'api', aliases: [] },
  wink: { label: '😉 غمزة', api: 'wink', type: 'api', aliases: [] },
  handhold: { label: '🤝 مسك اليد', api: 'handhold', type: 'api', aliases: [] },
  nom: { label: '🍪 أكل', api: 'nom', type: 'api', aliases: [] },
  glomp: { label: '💞 عناق قوي', api: 'glomp', type: 'api', aliases: [] },
  happy: { label: '😁 سعيد', api: 'happy', type: 'api', aliases: [] },
  poke: { label: '👉 وخزة', api: 'poke', type: 'api', aliases: [] },
  dance: { label: '💃 رقص', api: 'dance', type: 'api', aliases: [] },
  meme: { label: '🤣 ميم', isMeme: true, aliases: ['memes', 'meme2'] },
  loli: { label: '*أنا اللولي خاصتك uwu 😍*', type: 'json', url: 'https://raw.githubusercontent.com/elrebelde21/The-LoliBot-MD2/main/src/randow/loli.json', aliases: ['kawaii'] },
  navidad: { label: '🎄 كريسماس', type: 'json', url: 'https://raw.githubusercontent.com/elrebelde21/The-LoliBot-MD2/main/src/randow/navidad.json', aliases: [] },
  messi: { label: '*🇦🇷 ميسي*', type: 'json', url: 'https://raw.githubusercontent.com/elrebelde21/The-LoliBot-MD2/main/src/randow/messi.json', aliases: [] },
  ronaldo: { label: '_*Siiiuuuuuu*_', type: 'json', url: 'https://raw.githubusercontent.com/elrebelde21/The-LoliBot-MD2/main/src/randow/CristianoRonaldo.json', aliases: [] }
}

const aliasMap = {}
for (const [key, item] of Object.entries(contenido)) {
  aliasMap[key.toLowerCase()] = item
for (const alias of (item.aliases || [])) {
aliasMap[alias.toLowerCase()] = item
}}

let handler = async (m, { conn, command }) => {
  try {
    const item = aliasMap[command.toLowerCase()]
    if (!item) return m.reply('❌ أمر غير معروف.')

    if (item.isMeme) {
      const url = await hispamemes.meme();
conn.sendFile(m.chat, url, 'error.jpg', `😂🤣🤣`, m);   
      return
    }

if (item.type === 'json') {
const res = await axios.get(item.url)
const imgs = res.data
const img = imgs[Math.floor(Math.random() * imgs.length)]
await conn.sendMessage(m.chat, { image: { url: img }, caption: item.label }, { quoted: m })
return
}

    if (item.type === 'api') {
      let apiPath = `https://api.waifu.pics/sfw/${item.api}`
      try {
        const { rows } = await db.query(`SELECT modohorny FROM group_settings WHERE group_id = $1`, [m.chat])
        const isNSFW = rows[0]?.modohorny === true
        if (isNSFW && item.nsfwApi) {
          apiPath = `https://api.waifu.pics/nsfw/${item.nsfwApi}`
        }
      } catch (err) {
        console.error('❌ خطأ عند التحقق من NSFW:', err)
      }
      const res = await fetch(apiPath)
      const { url } = await res.json()
      await conn.sendFile(m.chat, url, 'error.jpg', item.label, m);   
      return
    }

    if (item.type === 'video') {
      const vid = item.vids[Math.floor(Math.random() * item.vids.length)]
      await conn.sendFile(m.chat, vid, 'error.mp4', item.label, m);   
      return
    }

    if (item.type === 'static') {
      const img = item.imgs[Math.floor(Math.random() * item.imgs.length)]
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: item.label }, { quoted: m })
      return
    }

  } catch (e) {
    console.error('[❌ ERROR IMG]', e)
    m.reply('❌ خطأ في إرسال الصورة.')
  }
}
handler.command = new RegExp(`^(${Object.keys(aliasMap).join('|')})$`, 'i')
handler.help = Object.keys(aliasMap)
handler.tags = ['randow']
handler.register = true

export default handler
