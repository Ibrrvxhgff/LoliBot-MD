import fg from 'api-dylux'
let handler = async (m, { conn, text, args }) => {
if (!text) return m.reply(`✳️ أدخل اسم مستخدم تيك توك`)
m.react("⌛");
try {
const apiUrl = `${info.apis}/tools/tiktokstalk?q=${encodeURIComponent(args[0])}`;
const apiResponse = await fetch(apiUrl);
const delius = await apiResponse.json();
if (!delius || !delius.result || !delius.result.users) return m.react("❌");
const profile = delius.result.users;
const stats = delius.result.stats;
const txt = `👤 *ملف تيك توك*:
*• اسم المستخدم*: ${profile.username}
*• اللقب*: ${profile.nickname}
*• موثق*: ${profile.verified ? 'نعم' : 'لا'}
*• المتابعون*: ${stats.followerCount.toLocaleString()}
*• يتابع*: ${stats.followingCount.toLocaleString()}
*• إجمالي الإعجابات*: ${stats.heartCount.toLocaleString()}
*• الفيديوهات*: ${stats.videoCount.toLocaleString()}
*• التوقيع*: ${profile.signature}
*• الرابط*: 
${profile.url}`;

await conn.sendFile(m.chat, profile.avatarLarger, 'tt.png', txt, m);
m.react("✅");
} catch (e2) {
try {
  let res = await fg.ttStalk(args[0])
  let txt = `👤 *ملف تيك توك*:
*• الاسم:* ${res.name}
*• اسم المستخدم:* ${res.username}
*• المتابعون:* ${res.followers}
*• يتابع:* ${res.following}
*• الوصف:* ${res.desc}
*• الرابط* : https://tiktok.com/${res.username}`
await conn.sendFile(m.chat, res.profile, 'tt.png', txt, m)
m.react("✅");
} catch (e) {
await m.react(`❌`) 
m.reply(`\`\`\`⚠️ حدث خطأ ⚠️\`\`\`\n\n> *أبلغ مطوري بهذا الخطأ باستخدام الأمر:*#report\n\n>>> ${e} <<<< `)       
console.log(e)
}}}
handler.help = ['tiktokstalk']
handler.tags = ['downloader']
handler.command = /^t(tstalk|iktokstalk|ملف_تيك_توك)$/i
handler.register = true
handler.limit = 1
export default handler
