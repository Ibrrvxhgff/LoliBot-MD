import {toAudio} from '../lib/converter.js';
const handler = async (m, {conn, usedPrefix, command}) => {
const q = m.quoted ? m.quoted : m;
const mime = (q || q.msg).mimetype || q.mediaType || '';
if (!/video|audio/.test(mime)) throw `*⚠️ وأين الفيديو؟ قم بالرد على مقطع فيديو أو ملاحظة صوتية لتحويله إلى MP3*`;
const media = await q.download();
if (!media) throw '*⚠️ حدث خطأ ما، لا أعرف ماذا حدث؟ هل تعرف؟* :)';
m.reply(`انتظر لحظة، أنا أقوم بالمعالجة 😎\n\n> *جاري التحويل من MP4 إلى MP3 🔄*`) 
const audio = await toAudio(media, 'mp4');
if (!audio.data) throw '*⚠️ خطأ فادح، ألا تعرف كيفية استخدام الأمر؟ قم بالرد على مقطع فيديو أو ملاحظة صوتية أيها الأحمق*';
conn.sendMessage(m.chat, { audio: audio.data, mimetype: 'audio/mpeg' }, { quoted: m });
};
handler.help = ['tomp3'];
handler.tags = ['convertidor']
handler.command = /^to(mp3|audio)|لصوتي$/i;
handler.register = true
export default handler;
