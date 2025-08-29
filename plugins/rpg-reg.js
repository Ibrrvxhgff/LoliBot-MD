import { createHash } from 'crypto';
import moment from 'moment-timezone'
import { db } from '../lib/postgres.js';

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const formatPhoneNumber = (jid) => {
  if (!jid) return null;
  const number = jid.replace('@s.whatsapp.net', '');
  if (!/^\d{8,15}$/.test(number)) return null;
  return `+${number}`;
};
const estados = {}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
let fkontak = {key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" }, message: {contactMessage: {vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, participant: "0@s.whatsapp.net"};
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
//let ppch = await conn.profilePictureUrl(who, 'image').catch(_ => imageUrl.getRandom())
const date = moment.tz('Asia/Riyadh').format('DD/MM/YYYY')
const time = moment.tz('Asia/Riyadh').format('LT')
let userNationality = null;
  try {
const phone = formatPhoneNumber(who);
if (phone) {
const response = await fetch(`${info.apis}/tools/country?text=${phone}`);
const data = await response.json();
userNationality = data.result ? `${data.result.name} ${data.result.emoji}` : null;
}} catch (err) {
userNationality = null;
}

const userResult = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [who]);
let user = userResult.rows[0] || { registered: false };
const input = text.trim()
  const step = estados[who]?.step || 0
let name2 = m.pushName || 'loli'
const totalRegResult = await db.query(`SELECT COUNT(*) AS total FROM usuarios WHERE registered = true`);
const rtotalreg = parseInt(totalRegResult.rows[0].total);

if (command === 'reg' || command === 'verify' || command === 'verificar' || command === 'تسجيل') {
if (user.registered) return m.reply(`*أنت مسجل بالفعل 🤨*`)
if (estados[who]?.step) return m.reply('⚠️ لديك عملية تسجيل جارية بالفعل. أكمل التسجيل بالرد على الخطوة السابقة.')
if (!Reg.test(text)) return m.reply(`*⚠️ هل لا تعرف كيفية استخدام هذا الأمر؟* استخدمه بالطريقة التالية:\n\n*${usedPrefix + command} الاسم.العمر*\n*• مثال:* ${usedPrefix + command} ${name2}.16`)

let [_, name, splitter, age] = text.match(Reg)
if (!name) return m.reply('*أين الاسم؟*')
if (!age) return m.reply('*لا يمكن أن يكون العمر فارغًا، أضف عمرك*')
if (name.length >= 45) return m.reply('*ماذا؟ هل سيكون اسمك بهذا الطول؟*')
age = parseInt(age)
if (age > 100) return m.reply('👴🏻 أنت كبير جدًا على هذا!')
if (age < 5) return m.reply('🚼 هل يعرف الأطفال الكتابة؟ ✍️😳')

estados[who] = { step: 1, nombre: name, edad: age, usedPrefix, userNationality }

return m.reply(`🧑 الخطوة الثانية للتسجيل: ما هو جنسك؟\n\n1. ذكر ♂️\n2. أنثى ♀️\n3. آخر 🧬\n\n*أجب بالرقم*`)
}

if (command == 'nserie' || command == 'myns' || command == 'sn' || command == 'رقمي_التسلسلي') {
if (!user.registered) return m.reply(`⚠️ *أنت غير مسجل(ة)*\n\nللتسجيل استخدم:\n*#تسجيل الاسم.العمر*`);
const sn = user.serial_number || createHash('md5').update(m.sender).digest('hex');
await conn.fakeReply(m.chat, sn, '0@s.whatsapp.net', `⬇️ هـذا هـو رقمـك التسلسلـي ⬇️`, 'status@broadcast')
}

if (command == 'unreg' || command == 'الغاء_التسجيل') {
if (!user.registered) return m.reply(`⚠️ *أنت غير مسجل(ة)*\n\nللتسجيل استخدم:\n*#تسجيل الاسم.العمر*`);
if (!args[0]) return m.reply( `✳️ *أدخل الرقم التسلسلي*\nتحقق من رقمك التسلسلي بالأمر...\n\n*${usedPrefix}رقمي_التسلسلي*`)
const user2 = userResult.rows[0] || {};
const sn = user2.serial_number || createHash('md5').update(m.sender).digest('hex');
if (args[0] !== sn) return m.reply('⚠️ *رقم تسلسلي غير صحيح*')
await db.query(`UPDATE usuarios
        SET registered = false,
            nombre = NULL,
            edad = NULL,
            money = money - 400,
            limite = limite - 2,
            exp = exp - 150,
            reg_time = NULL,
            serial_number = NULL
        WHERE id = $1`, [m.sender]);
await conn.fakeReply(m.chat, `😢 لم تعد مسجلاً`, '0@s.whatsapp.net', `تم حذف التسجيل`, 'status@broadcast')
}

if (command === 'setgenero' || command === 'تحديد_الجنس') {
const genero = (args[0] || '').toLowerCase()
if (!['ذكر', 'انثى', 'آخر'].includes(genero)) return m.reply(`✳️ *استخدم:*\n${usedPrefix}تحديد_الجنس <ذكر|انثى|آخر>\n📌 مثال: *${usedPrefix}تحديد_الجنس ذكر*`)
const userResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [who])
if (!userResult.rows[0]?.registered) return m.reply('⚠️ *يجب أن تكون مسجلاً لاستخدام هذا الأمر.*')
await db.query('UPDATE usuarios SET gender = $1 WHERE id = $2', [genero, who])
return m.reply(`✅ *تم حفظ الجنس:* ${genero}`)
}

if (command === 'setbirthday' || command === 'تحديد_ميلادي') {
let birthday = args.join(' ').trim()
if (!birthday) return m.reply(`✳️ *استخدم:*\n${usedPrefix}تحديد_ميلادي <التاريخ>\n📌 مثال: *${usedPrefix}تحديد_ميلادي 30/10/2000*`)
if (birthday.toLowerCase() === 'حذف') {
await db.query('UPDATE usuarios SET birthday = NULL WHERE id = $1', [who])
return m.reply('✅ *تم حذف تاريخ الميلاد بنجاح.*')
}
try {
const fecha = moment(birthday, ['DD/MM/YYYY', 'D [de] MMMM [de] YYYY'], true)
if (!fecha.isValid()) throw new Error('formato')
await db.query('UPDATE usuarios SET birthday = $1 WHERE id = $2', [fecha.format('YYYY-MM-DD'), who])
return m.reply(`✅ *تم حفظ تاريخ الميلاد:* ${birthday}`)
} catch {
return m.reply('❌ صيغة غير صالحة. مثال: 25/7/2009')
}}
}

handler.before = async (m, { conn, usedPrefix }) => {
let fkontak = {key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" }, message: {contactMessage: {vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, participant: "0@s.whatsapp.net"};
  const who = m.sender
  const step = estados[who]?.step
  const input = (m.originalText || m.text || '').trim()
  const totalRegResult = await db.query(`SELECT COUNT(*) AS total FROM usuarios WHERE registered = true`);
const rtotalreg = parseInt(totalRegResult.rows[0].total);
  if (!step) return

  if (!m.text.startsWith(usedPrefix)) {
    if (step === 1) {
  let lower = input.toLowerCase()
  let genero = lower === '1' || lower === 'ذكر'   ? 'ذكر' : lower === '2' || lower === 'انثى'   ? 'انثى'  : lower === '3' || lower === 'آخر'     ? 'آخر'   : null
  if (!genero) return m.reply('⚠️ أجب بـ 1، 2، 3، ذكر، انثى أو آخر لتحديد جنسك')
  estados[who].genero = genero
  estados[who].step = 2
  return m.reply(`🎂 *الخطوة الثالثة للتسجيل: تاريخ الميلاد (اختياري)*\n\nيمكنك إرسال تاريخ ميلادك بصيغة DD/MM/YYYY (مثال: 30/10/2000)\n\n> أو اكتب "تخطي" إذا كنت لا تريد الإفصاح عنه`)
}
    if (step === 2) {
      let cumple = null
      let cumpleTexto = null
      if (input.toLowerCase() !== 'تخطي') {
        try {
          const fecha = moment(input, ['DD/MM/YYYY', 'D [de] MMMM [de] YYYY'], true)
          if (!fecha.isValid()) throw new Error('invalid')
          cumple = fecha.format('YYYY-MM-DD')
          cumpleTexto = input
        } catch {
          return m.reply('❌ صيغة غير صالحة. مثال: 27/5/2009')
        }
      }
      const pref = estados[who]?.usedPrefix || '.'
const userNationality = estados[who]?.userNationality || ''
      const { nombre, edad, genero } = estados[who]
      const serial = createHash('md5').update(who).digest('hex')
      const reg_time = new Date()
      await db.query(`
        INSERT INTO usuarios (id, nombre, edad, gender, birthday, money, limite, exp, reg_time, registered, serial_number)
        VALUES ($1,$2,$3,$4,$5,400,2,150,$6,true,$7)
        ON CONFLICT (id) DO UPDATE
        SET nombre = $2, edad = $3, gender = $4, birthday = $5,
            money = usuarios.money + 400,
            limite = usuarios.limite + 2,
            exp = usuarios.exp + 150,
            reg_time = $6,
            registered = true,
            serial_number = $7
      `, [who, nombre + '✓', edad, genero, cumple, reg_time, serial])

      const date = moment.tz('Asia/Riyadh').format('DD/MM/YYYY')
      const time = moment.tz('Asia/Riyadh').format('LT')

      delete estados[who]

      return await conn.sendMessage(m.chat, { text: `[ ✅ اكتمل التسجيل ]

◉ *الاسم:* ${nombre}
◉ *العمر:* ${edad} سنة
◉ *الجنس:* ${genero} ${cumpleTexto ? `\n◉ *تاريخ الميلاد:* ${cumpleTexto}` : ''}
◉ *الوقت:* ${time}
◉ *التاريخ:* ${date} ${userNationality ? `\n◉ *الدولة:* ${userNationality}` : ''}
◉ *الرقم:* wa.me/${who.split('@')[0]}
◉ *الرقم التسلسلي:*
⤷ ${serial}

🎁 *المكافأة:*
⤷ 2 ألماس 💎
⤷ 400 عملة 🪙
⤷ 150 خبرة

*◉ لرؤية أوامر البوت استخدم:*
${pref}menu

◉ *إجمالي المستخدمين المسجلين:* ${toNum(rtotalreg + 1)}`,
contextInfo: {
forwardedNewsletterMessageInfo: {
newsletterJid: '120363305025805187@newsletter',
serverMessageId: '',
newsletterName: 'LoliBot ✨️' },
forwardingScore: 9999999,
isForwarded: true,
externalAdReply: {
mediaUrl: info.md,
mediaType: 2,
showAdAttribution: false,
renderLargerThumbnail: false,
title: `اكتمــل التسجيــل`,
body: 'LoliBot',
previewType: 'PHOTO',
thumbnailUrl: "https://telegra.ph/file/33bed21a0eaa789852c30.jpg",
sourceUrl: info.md
}}}, { quoted: fkontak, ephemeralExpiration: 24 * 60 * 1000, disappearingMessagesInChat: 24 * 60 * 1000 });
    }
  }
}

handler.help = ['تسجيل <الاسم.العمر>', 'تحقق <الاسم.العمر>', 'رقمي_التسلسلي', 'الغاء_التسجيل <الرقم التسلسلي>', 'تحديد_الجنس', 'تحديد_ميلادي'];
handler.tags = ['rg'];
handler.command = /^(setbirthday|تحديد_ميلادي|setgenero|تحديد_الجنس|nserie|رقمي_التسلسلي|unreg|الغاء_التسجيل|sn|myns|verify|verificar|تحقق|registrar|reg(ister)?|تسجيل)$/i;

export default handler;

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number <= -1000 && number > -1000000) {
    return (number / 1000).toFixed(1) + 'k';
  } else if (number <= -1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else {
    return number.toString();
  }
}
