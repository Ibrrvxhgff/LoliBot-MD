import axios from 'axios';
import fetch from 'node-fetch';
import search from 'yt-search';
const userMessages = new Map();
const userRequests = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return m.reply(`*🤔 ما الذي تبحث عنه؟ أدخل اسم الأغنية لتنزيلها من سبوتيفاي، مثال:* ${usedPrefix + command} ozuna`);
if (userRequests[m.sender]) return await conn.reply(m.chat, `⚠️ مهلاً @${m.sender.split('@')[0]}، أنت تقوم بالفعل بتنزيل أغنية 🙄\nانتظر حتى ينتهي التنزيل الحالي قبل طلب أغنية أخرى. 👆`, userMessages.get(m.sender) || m);
userRequests[m.sender] = true;
m.react(`⌛`);
try {
const spotify = await fetch(`${info.apis}/search/spotify?q=${text}`);
const song = await spotify.json();
if (!song.data || song.data.length === 0) return m.reply('⚠️ لم يتم العثور على نتائج لهذا البحث.');
const track = song.data[0];
const spotifyMessage = `*• العنوان:* ${track.title}\n*• الفنان:* ${track.artist}\n*• الألبوم:* ${track.album}\n*• المدة:* ${track.duration}\n*• تاريخ النشر:* ${track.publish}\n\n> 🚀 *جارٍ إرسال الأغنية، يرجى الانتظار لحظة....*`;
const message = await conn.sendMessage(m.chat, { text: spotifyMessage, 
contextInfo: {
forwardingScore: 1,
isForwarded: true,
externalAdReply: {
showAdAttribution: true,
containsAutoReply: true,
renderLargerThumbnail: true,
title: track.title,
body: "جارٍ إرسال الأغنية، يرجى الانتظار لحظة 🚀",
mediaType: 1,
thumbnailUrl: track.image,
mediaUrl: track.url,
sourceUrl: track.url
}}}, { quoted: m });
userMessages.set(m.sender, message);

const downloadAttempts = [async () => {
const res = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${track.url}`);
const data = await res.json();
return data.data.download;
},
async () => {
const res = await fetch(`${info.apis}/download/spotifydl?url=${track.url}`);
const data = await res.json();
return data.data.url;
}];

let downloadUrl = null;
for (const attempt of downloadAttempts) {
try {
downloadUrl = await attempt();
if (downloadUrl) break; 
} catch (err) {
console.error(`Error in attempt: ${err.message}`);
continue; 
}}

if (!downloadUrl) throw new Error('لم يتمكن من تنزيل الأغنية من أي واجهة برمجة تطبيقات');
await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, fileName: `${track.title}.mp3`, mimetype: 'audio/mpeg', contextInfo: {} }, { quoted: m });
m.react('✅️');
} catch (error) {
m.reply(`\`\`\`⚠️ حدث خطأ ⚠️\`\`\`\n\n> *أبلغ مطوري بهذا الخطأ باستخدام الأمر:* #report\n\n>>> ${error} <<<< `);
console.log(error);
m.react('❌');
handler.limit = false;
} finally {
delete userRequests[m.sender];
}};
handler.help = ['spotify'];
handler.tags = ['downloader'];
handler.command = /^(spotify|music|سبوتيفاي)$/i;
handler.register = true;
handler.limit = 1;

export default handler;

// The rest of the spotify utility functions remain unchanged...