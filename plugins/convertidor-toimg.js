import { webp2png } from '../lib/webp2mp4.js';
const handler = async (m, { conn, usedPrefix, command }) => {
const notStickerMessage = `*⚠️ قم بالرد على ملصق تريد تحويله إلى صورة باستخدام الأمر التالي:* ${usedPrefix + command}`;
if (!m.quoted) throw notStickerMessage;
const q = m.quoted;
const mime = q?.mimetype || '';
if (!mime.includes('webp')) throw notStickerMessage;
m.reply(`Espera un momento...\n\n> *أقوم بتحويل ملصقك إلى صورة 🔄*`);
const media = await q.download();
const out = await webp2png(media).catch(() => null) || Buffer.alloc(0);
await conn.sendFile(m.chat, out, 'sticker.png', null, m);
};
handler.help = ['toimg (reply)'];
handler.tags = ['convertidor'];
handler.command = ['toimg', 'jpg', 'img', 'لصورة'];
handler.register = true;

export default handler;
