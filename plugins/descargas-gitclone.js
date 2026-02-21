import fetch from 'node-fetch';
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
const userCaptions = new Map();
const userRequests = {};

let handler = async (m, { args, usedPrefix, command, conn }) => {
if (!args[0]) throw `*⚠️ الرجاء إدخال رابط GitHub*\n• *مثال:* ${usedPrefix + command} https://github.com/elrebelde21/LoliBot-MD`
if (!regex.test(args[0])) return m.reply(`⚠️ هذا ليس رابط GitHub صالحًا 🤡`)
if (userRequests[m.sender]) {
conn.reply(m.chat, `⏳ *مرحبًا @${m.sender.split('@')[0]} انتظر...* يوجد طلب قيد المعالجة بالفعل. من فضلك، انتظر حتى ينتهي قبل تقديم طلب آخر...`, userCaptions.get(m.sender) || m)
return;
}
userRequests[m.sender] = true;
try {   
const downloadGit = await conn.reply(m.chat, `*⌛ اهدأ ✋ يا صديقي، أنا أرسل الملف الآن 🚀*\n*إذا لم يصلك الملف، فقد يكون ذلك بسبب أن المستودع كبير جدًا*`, m, {
contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: info.wm, body: ' 💫 𝐒𝐮𝐩𝐞𝐫 𝐁𝐨𝐭 𝐃𝐞 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 🥳 ', previewType: 0, thumbnail: m.pp, sourceUrl: info.nna}}});   
userCaptions.set(m.sender, downloadGit);
let [_, user, repo] = args[0].match(regex) || [];
repo = repo.replace(/.git$/, '');
let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];
await conn.sendFile(m.chat, url, filename, null, m);
} catch (e) { 
m.reply(`\`\`\`⚠️ حدث خطأ ⚠️\`\`\`\n\n> *أبلغ المطور بالخطأ التالي باستخدام الأمر:* #report\n\n>>> ${e} <<<< `);       
console.log(e);
handler.limit = 0; // ❌ No gasta diamante si el comando falla
} finally {
delete userRequests[m.sender];
}};
handler.help = ['gitclone <url>'];
handler.tags = ['downloader'];
handler.command = /gitclone|clonarepo|clonarrepo|repoclonar|استنساخ/i;
handler.register = true;
handler.limit = 2;
handler.level = 1

export default handler;