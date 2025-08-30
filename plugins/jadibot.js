import { startSubBot } from '../lib/subbot.js';
let commandFlags = {}; 

const handler = async (m, { conn, command }) => {
commandFlags[m.sender] = true;
  
const rtx = `*🔰 LoliBot-MD 🔰*\nㅤㅤㅤㅤلتصبح بوت فرعي\n\n*امسح رمز QR هذا من هاتف آخر أو من الكمبيوتر لتصبح بوتًا فرعيًا*\n\n*١. اضغط على النقاط الثلاث في الزاوية العلوية اليمنى*\n*٢. اختر واتساب ويب*\n*٣. امسح رمز QR هذا*\n*ينتهي صلاحية رمز QR هذا خلال 45 ثانية!*\n\n> *⚠️ نحن غير مسؤولين عن أي سوء استخدام قد يحدث.*`;
const rtx2 = `*🔰 LoliBot-MD 🔰*\nㅤㅤㅤㅤلتصبح بوت فرعي\n\n*١️⃣ اذهب إلى النقاط الثلاث في الزاوية العلوية اليمنى*\n*٢️⃣ خيار: الأجهزة المرتبطة*\n*٣️⃣ ربط باستخدام رقم الهاتف*\n*٤️⃣ الصق الرمز أدناه*\n> رمز مكون من 8 أرقام، تنتهي صلاحيته خلال 60 ثانية`;

const phone = m.sender?.split('@')[0];
const isCode = /^(serbot|code)$/.test(command);
const caption = isCode ? rtx2 : rtx;
await startSubBot(m, conn, caption, isCode, phone, m.chat, commandFlags);
};
handler.help = ['jadibot', 'serbot', 'code'];
handler.tags = ['jadibot'];
handler.command = /^(serbot|code|jadibot|qr)$/i;
handler.register = false;

export default handler;
