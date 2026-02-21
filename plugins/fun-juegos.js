import util from 'util'
import path from 'path' 
import fetch from 'node-fetch';
let toM = a => '@' + a.split('@')[0] 
let handler = async (m, { conn, metadata, command, text, participants, usedPrefix}) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
try {

let user = a => '@' + a.split('@')[0]
let ps = metadata.participants.map(v => v.id)
let a = ps.getRandom()
let b = ps.getRandom() 
let c = ps.getRandom()
let d = ps.getRandom()
let e = ps.getRandom()
let f = ps.getRandom()
let g = ps.getRandom()
let h = ps.getRandom()
let i = ps.getRandom()
let j = ps.getRandom() 

if (command == 'صداقة' || command == 'صديق_عشوائي') {   
m.reply(`*🔰 لنقم بتكوين بعض الصداقات 🔰*\n\n*مرحبًا ${toM(a)}، تحدث مع ${toM(b)} على الخاص للعب وتكوين صداقة 🙆*\n\n*أفضل الصداقات تبدأ بلعبة 😉*`, null, {
mentions: [a, b]})}

if (command == 'تحدي') {   
if (!text) return m.reply(`*منشن الشخص الذي تريد تحديه*`) 
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
conn.reply(m.chat, `*😂 لقد قبلت التحدي! 😂*\n\n*${text}* لقد تحداك ${toM(m.sender)}. الآن عليكما أن تقررا نوع التحدي!`, { mentions: [user, m.sender] })}

if (command == 'زواج' || command == 'تزويج') {
m.reply(`*${toM(a)}, حان الوقت 💍 للزواج من ${toM(b)}, ثنائي جميل 😉💓*`, null, {
mentions: [a, b]})}
  
if (command == 'شخصية') {
if (!text) return conn.reply(m.chat, 'أدخل اسمًا؟', m)
let personalidad = `┏━━°❀❬ *شخصية* ❭❀°━━┓
*┃*
*┃• الاسم* : ${text}
*┃• الأخلاق الحميدة* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• الأخلاق السيئة* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• نوع الشخص* : ${pickRandom(['طيب القلب','متعجرف','بخيل','كريم','متواضع','خجول','جبان','فضولي','حساس','غير محدد XD', 'أحمق'])}
*┃• دائمًا* : ${pickRandom(['ثقيل','مزاجي','شارد الذهن','مزعج','نمام','يضيع وقته','يتسوق','يشاهد الأنمي','يدردش على واتساب لأنه أعزب','مستلقي لا يفعل شيئًا','زير نساء','على الهاتف'])}
*┃• الذكاء* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• المماطلة* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• الشجاعة* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• الخوف* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• الشهرة* : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
*┃• الجنس* : ${pickRandom(['رجل', 'امرأة', 'مثلي', 'مزدوج الميول', 'شامل الميول', 'نسوي', 'مغاير', 'رجل ألفا', 'امرأة قوية', 'مسترجلة', 'محايد', 'PlayStationSexual', 'سيد مانويلا', 'Pollosexual'])}
┗━━━━━━━━━━━━━━━━`
conn.reply(m.chat, personalidad, m, { mentions: conn.parseMention(personalidad) })}

if (command == 'توافق' || command == 'ship') {
if (!text) return m.reply(`⚠️ اكتب اسم شخصين لحساب حبهما`)
let [text1, ...text2] = text.split(' ')
text2 = (text2 || []).join(' ')
if (!text2) throw `⚠️ ينقص اسم الشخص الثاني`
let love = `_❤️ *${text1}* فرصتك في الوقوع في حب *${text2}* هي *${Math.floor(Math.random() * 100)}%* 👩🏻‍❤️‍👨🏻_ `.trim()
m.reply(love, null, { mentions: conn.parseMention(love) })
}

if (command == 'اختراق' || command == 'doxxear') {
let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
let start = `*😱 ¡¡بدء الاختراق!! 😱*`
let boost5 = `*100%*`

const { key } = await conn.sendMessage(m.chat, {text: `${start}`, mentions: conn.parseMention(text)}, {quoted: m}) 
await delay(1000 * 4)
await conn.sendMessage(m.chat, {text: `${boost5}`, edit: key})

let old = performance.now()
let neww = performance.now()
let speed = `${neww - old}`
let doxeo = `*✅ تم اختراق الشخص بنجاح 🤣*\n\n*الوقت: ${speed} ثانية!*

*النتائج:*
*الاسم:* ${text}
*IP:* 192.28.213.234
*N:* 43 7462
*W:* 12.4893
*SS NUMBER:* 6979191519182016
*IPV6:* fe80::5dcd::ef69::fb22::d9888%12 
*UPNP:* Enabled
*DMZ:* 10.112.42.15
*MAC:* 5A:78:3E:7E:00
*ISP:* TORNADO SLK PRODUCTION
*DNS:* 8.8.8.8
*ALT DNS:* 1.1.1.1.1  
*DNS SUFFIX:* TORNADO WI-FI
*WAN:* 100.23.10.90
*WAN TYPE:* private nat
*GATEWAY:* 192.168.0.1
*SUBNET MASK:* 255.255.0.255
*UDP OPEN PORTS:* 8080.80
*TCP OPEN PORTS:* 443
*ROUTER VENDEDOR:* ERICCSON
*DEVICE VENDEDOR:* WIN32-X
*CONNECTION TYPE:* TORNADO SLK PRODUCTION
*ICMPHOPS:* 192.168.0.1 192.168.1.1 100.73.43.4
host-132.12.32.167.ucom.com
host-132.12.111.ucom.com
36.134.67.189 216.239.78.11
Sof02s32inf14.1e100.net
*HTTP:* 192.168.3.1:433-->92.28.211.234:80
*Http:* 192.168.625-->92.28.211.455:80
*Http:* 192.168.817-->92.28.211.8:971
*Upd:* 192.168452-->92.28.211:7265288
*Tcp:* 192.168.682-->92.28.211:62227.7
*Tcp:* 192.168.725-->92.28.211:67wu2
*Tcp:* 192.168.629-->92.28.211.167:8615
*EXTERNAL MAC:* 6U:77:89:ER:O4
*MODEM JUMPS:* 58`
await conn.sendMessage(m.chat, {text: doxeo, edit: key})
}

if (command == 'مثلي' || command == 'gay') {
let vn = 'https://qu.ax/HfeP.mp3'
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let random = `${Math.floor(Math.random() * 100)}`
let gay = random
if (gay < 20 ) {gay = 'أنت مستقيم 🤪🤙'} else if (gay < 40 ) {gay = 'لدي شكوكي 😑'} else if (gay < 60) {gay = 'هل أنا على حق؟ 😏'} else if (gay < 80) {gay = 'هل أنت كذلك أم لا؟ 🧐'} else {gay = 'أنت مثلي 🥸'}
let jawab = `@${who.split("@")[0]} هو 🏳️‍🌈 ${random}% مثلي\n\n${gay}`;
const avatar = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');

    const imageRes = await fetch(`https://some-random-api.com/canvas/gay?avatar=${encodeURIComponent(avatar)}`);
    const buffer = await imageRes.buffer();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: jawab,
      contextInfo: {
        mentionedJid: [who],
        forwardingScore: 9999999,
        isForwarded: false
      }
    }, { quoted: m, ephemeralExpiration: 24 * 60 * 1000 });

    await conn.sendFile(m.chat, vn, 'gay.mp3', null, m, true, {
      type: 'audioMessage',
      ptt: true
    });
  }

if (command == 'حب') {
if (!text) return m.reply(`🤔 أيها الأحمق، منشن الشخص باستخدام @Tag` ) 
conn.reply(m.chat, ` *❤️❤️ مقياس الحب ❤️❤️* 
*حب ${text} لك هو* *${Math.floor(Math.random() * 100)}%* *من 100%*
*هل يجب أن تطلب منها أن تكون حبيبتك؟*`.trim(), m, m.mentionedJid ? {
 mentions: m.mentionedJid
 } : {})} 

if (command == 'توب') {
if (!text) return m.reply(`والنص؟ 🤔\n📍 مثال: ${usedPrefix}توب أغبياء`)
let ps = metadata.participants.map(v => v.id)
let a = ps.getRandom()
let b = ps.getRandom()
let c = ps.getRandom()
let d = ps.getRandom()
let e = ps.getRandom()
let f = ps.getRandom()
let g = ps.getRandom()
let h = ps.getRandom()
let i = ps.getRandom()
let j = ps.getRandom()
let top = `*${pickRandom(['🤓','😅','😂','😳','😎', '🥵', '😱', '🤑', '🙄', '💩','🍑','🤨','🥴','🔥','👇🏻','😔', '👀','🌚'])} أفضل 10 ${text} ${pickRandom(['🤓','😅','😂','😳','😎', '🥵', '😱', '🤑', '🙄', '💩','🍑','🤨','🥴','🔥','👇🏻','😔', '👀','🌚'])}*
    
*1. ${user(a)}*
*2. ${user(b)}*
*3. ${user(c)}*
*4. ${user(d)}*
*5. ${user(e)}*
*6. ${user(f)}*
*7. ${user(g)}*
*8. ${user(h)}*
*9. ${user(i)}*
*10. ${user(j)}*`
m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j]})
}
if (command == 'توب_مثليين') {
let vn = 'https://qu.ax/HfeP.mp3'
let top = `*🌈أفضل 10 مثليين/مثليات في المجموعة🌈*
    
*_1.- 🏳️‍🌈 ${user(a)}_* 🏳️‍🌈
*_2.- 🪂 ${user(b)}_* 🪂
*_3.- 🪁 ${user(c)}_* 🪁
*_4.- 🏳️‍🌈 ${user(d)}_* 🏳️‍🌈
*_5.- 🪂 ${user(e)}_* 🪂
*_6.- 🪁 ${user(f)}_* 🪁
*_7.- 🏳️‍🌈 ${user(g)}_* 🏳️‍🌈
*_8.- 🪂 ${user(h)}_* 🪂
*_9.- 🪁 ${user(i)}_* 🪁
*_10.- 🏳️‍🌈 ${user(j)}_* 🏳️‍🌈`
m.reply(top, null, { mentions: conn.parseMention(top) })
conn.sendFile(m.chat, vn, 'error.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true })}
    
if (command == 'توب_اوتاكو') {
let vn = 'https://qu.ax/ZgFZ.mp3'
let top = `*🌸 أفضل 10 أوتاكو في المجموعة 🌸*
    
*_1.- 💮 ${user(a)}_* 💮
*_2.- 🌷 ${user(b)}_* 🌷
*_3.- 💮 ${user(c)}_* 💮
*_4.- 🌷 ${user(d)}_* 🌷
*_5.- 💮 ${user(e)}_* 💮
*_6.- 🌷 ${user(f)}_* 🌷
*_7.- 💮 ${user(g)}_* 💮
*_8.- 🌷 ${user(h)}_* 🌷
*_9.- 💮 ${user(i)}_* 💮
*_10.- 🌷 ${user(j)}_* 🌷`
m.reply(top, null, { mentions: conn.parseMention(top) })
conn.sendFile(m.chat, vn, 'otaku.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})}
   
} catch (e) {
console.log(e)}
}
handler.help = ["حب", "مثلي", "شخصية", "توافق", "توب", "توب_مثليين", "توب_اوتاكو", "اختراق", "تحدي", "زواج"];
handler.tags = ['game'];
handler.command = /^حب|مثلي|شخصية|توافق|توب|توب_مثليين|توب_اوتاكو|اختراق|doxxear|تحدي|زواج|تزويج|صداقة|صديق_عشوائي|gay/i
handler.register = true
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))