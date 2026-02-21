import yts from 'yt-search';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
if (!text) return m.reply(`*ما الذي تبحث عنه؟* أدخل اسم الموضوع\n*• مثال*\n*${usedPrefix + command}* bad bunny`);
m.react('📀');
let result = await yts(text);
let ytres = result.videos;
if (!ytres.length) return m.reply('❌ لم يتم العثور على نتائج.');
let textoo = `*• نتائج البحث عن:*  ${text}\n\n`;
for (let i = 0; i < Math.min(15, ytres.length); i++) { 
let v = ytres[i];
textoo += `🎵 *العنوان:* ${v.title}\n📆 *تم النشر قبل:* ${v.ago}\n👀 *المشاهدات:* ${v.views}\n⌛ *المدة:* ${v.timestamp}\n🔗 *الرابط:* ${v.url}\n\n⊱ ────── {.⋅ ♫ ⋅.} ───── ⊰\n\n`;
}
await conn.sendFile(m.chat, ytres[0].image, 'thumbnail.jpg', textoo, m);
};
handler.help = ['playlist', 'yts'];
handler.tags = ['downloader'];
handler.command = ['playvid2', 'playlist', 'playlista', 'yts', 'ytsearch', 'قائمة_تشغيل', 'بحث_يوتيوب'];
handler.register = true;
export default handler;