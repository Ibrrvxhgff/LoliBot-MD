import moment from 'moment-timezone'
import { xpRange } from '../lib/levelling.js'
import { db } from '../lib/postgres.js'
import fs from "fs";

// تخزين مؤقت لتحديد فترة انتظار بين الأوامر
const cooldowns = new Map()
// مدة الانتظار بالمللي ثانية (3 دقائق)
const COOLDOWN_DURATION = 180000

// تصنيفات الأوامر لعرضها في القائمة
const tags = {
main: 'ℹ️ معلومات البوت',
jadibot: '✨ كن بوت فرعي',
downloader: '🚀 تحميلات',
game: '👾 ألعاب',
gacha: '✨️ جديد - نظام غاتشا',
rg: '🟢 تسجيل',
group: '⚙️ مجموعة',
nable: '🕹 تفعيل/تعطيل',
nsfw: '🥵 أوامر +18',
buscadores: '🔍 أدوات البحث',
sticker: '🧧 ملصقات',
econ: '🛠 اقتصاد',
convertidor: '🎈 محولات',
logo: '🎀 شعارات',
tools: '🔧 أدوات',
randow: '🪄 عشوائي',
efec: '🎙 مؤثرات صوتية',
owner: '👑 المالك'
}

// القالب الافتراضي لشكل القائمة
const defaultMenu = {
before: `「 %wm 」

أهلاً 👋🏻 *%name*

*• التاريخ:* %fecha
*• الوقت:* %hora (🇸🇦) 
*• المستخدمون:* %totalreg
*• مدة التشغيل:* %muptime
*• حدودك:* %limit
%botOfc

*• المسجلون:* %toUserReg من %toUsers

انضم إلى قناتنا على الواتساب لتبقى على اطلاع بآخر أخبار وتحديثات البوت والمزيد
%nna2

*يمكنك التحدث مع البوت بهذه الطريقة، مثال:*
@%BoTag ما هي واجهة برمجة التطبيقات؟
`.trimStart(),
  header: '┌───「 %category 」───┐',
  body: '│ • %cmd %islimit %isPremium',
  footer: '└───────────┘\n',
  after: ''
}

const handler = async (m, { conn, usedPrefix: _p, args }) => {
const chatId = m.key?.remoteJid;
const now = Date.now();
const chatData = cooldowns.get(chatId) || { lastUsed: 0, menuMessage: null };
const timeLeft = COOLDOWN_DURATION - (now - chatData.lastUsed);

// التحقق من فترة الانتظار
if (timeLeft > 0) {
try {
const senderTag = m.sender ? `@${m.sender.split('@')[0]}` : '@مستخدم';
await conn.reply(chatId, `⚠️ يا ${senderTag}، القائمة موجودة بالفعل 🙄\n> لتجنب الإزعاج، سيتم إرسالها كل 3 دقائق فقط. مرر للأعلى لرؤيتها بالكامل. 👆`, chatData.menuMessage || m);
} catch (err) {
return;
}
return;
}

const name = m.pushName || 'بلا اسم';
// تعديل المنطقة الزمنية إلى 'Asia/Riyadh'
const fecha = moment.tz('Asia/Riyadh').format('DD/MM/YYYY');
const hora = moment.tz('Asia/Riyadh').format('HH:mm:ss');
const _uptime = process.uptime() * 1000;
const muptime = clockString(_uptime);

let user;
try {
const userRes = await db.query(`SELECT * FROM usuarios WHERE id = $1`, [m.sender]);
user = userRes.rows[0] || { limite: 0, level: 0, exp: 0, role: '-' };
} catch (err) {
user = { limite: 0, level: 0, exp: 0, role: '-' };
}

let totalreg = 0;
let rtotalreg = 0;
try {
const userCountRes = await db.query(`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE registered = true)::int AS registrados
      FROM usuarios
    `);
totalreg = userCountRes.rows[0].total;
rtotalreg = userCountRes.rows[0].registrados;
} catch (err) {
}
const toUsers = toNum(totalreg);
const toUserReg = toNum(rtotalreg);
const nombreBot = conn.user?.name || 'Bot'
const isPrincipal = conn === global.conn;
// ترجمة نوع البوت
const tipo = isPrincipal ? 'بوت رسمي' : 'بوت فرعي';
let botOfc = '';
let BoTag = "";
if (conn.user?.id && global.conn?.user?.id) {
const jidNum = conn.user.id.replace(/:\d+/, '').split('@')[0];
// ترجمة رسالة تعريف البوت
botOfc = (conn.user.id === global.conn.user.id) ? `*• البوت الرسمي:* wa.me/${jidNum}` : `*• أنا بوت فرعي لـ:* wa.me/${global.conn.user.id.replace(/:\d+/, '').split('@')[0]}`;
BoTag = jidNum;
}

const multiplier = "750" || 1.5;
const { min, xp, max } = xpRange(user.level || 0, multiplier);

// تصفية وتجميع الأوامر
const help = Object.values(global.plugins).filter(p => !p.disabled).map(plugin => ({
help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
prefix: 'customPrefix' in plugin,
limit: plugin.limit,
premium: plugin.premium
}));

const categoryRequested = args[0]?.toLowerCase();
const validTags = categoryRequested && tags[categoryRequested] ? [categoryRequested] : Object.keys(tags);
let text = defaultMenu.before;

// بناء نص القائمة
for (const tag of validTags) {
const comandos = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help);
if (!comandos.length) continue;

text += '\n' + defaultMenu.header.replace(/%category/g, tags[tag]) + '\n';
for (const plugin of comandos) {
for (const helpCmd of plugin.help) {
text += defaultMenu.body
.replace(/%cmd/g, plugin.prefix ? helpCmd : _p + helpCmd)
.replace(/%islimit/g, plugin.limit ? '(💎)' : '')
.replace(/%isPremium/g, plugin.premium ? '(💵)' : '') + '\n';
}}
text += defaultMenu.footer;
}
text += defaultMenu.after;

// استبدال المتغيرات في القالب بالقيم الفعلية
const replace = {
'%': '%', p: _p, name,
limit: user.limite || 0,
level: user.level || 0,
role: user.role || '-',
totalreg, rtotalreg, toUsers, toUserReg,
exp: (user.exp || 0) - min,
maxexp: xp,
totalexp: user.exp || 0,
xp4levelup: max - (user.exp || 0),
fecha, hora, muptime,
wm: info.wm,
botOfc: botOfc,
BoTag: BoTag,
nna2: info.nna2
};

text = String(text).replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, key) => replace[key] ?? '');
try {
let pp = fs.readFileSync('./media/Menu2.jpg');
// إرسال القائمة
const menuMessage = await conn.sendMessage(chatId, { text: text, contextInfo: { forwardedNewsletterMessageInfo: { newsletterJid: "120363305025805187@newsletter",newsletterName: "LoliBot ✨️" }, forwardingScore: 999, isForwarded: true, mentionedJid: await conn.parseMention(text), externalAdReply: { mediaUrl:  [info.nna, info.nna2, info.md].getRandom(), mediaType: 2, showAdAttribution: false, renderLargerThumbnail: false, title: "✨️ القائمة ✨️", body: `${nombreBot} (${tipo})`, thumbnailUrl: info.img2, sourceUrl: "https://skyultraplus.com" }}}, { quoted: m });
cooldowns.set(chatId, { lastUsed: now, menuMessage: menuMessage })
m.react('🙌');
} catch (err) {     
m.react('❌')
console.error(err);
}}

// تحديد اسم الأمر والوسوم الخاصة به
handler.help = ['القائمة', 'menu']
handler.tags = ['main']
handler.command = /^(menu|help|allmenu|menú|القائمة|اوامر|الأوامر)$/i
export default handler

// دالة لتحويل المللي ثانية إلى تنسيق HH:MM:SS
const clockString = ms => {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

// دالة لاختصار الأرقام الكبيرة (مليون 'M'، ألف 'k')
const toNum = n => (n >= 1_000_000) ? (n / 1_000_000).toFixed(1) + 'M'
  : (n >= 1_000) ? (n / 1_000).toFixed(1) + 'k'
  : n.toString()
