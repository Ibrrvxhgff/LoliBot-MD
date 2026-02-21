import fg from 'api-dylux'
let handler= async (m, { conn, args, text, usedPrefix, command }) => {
if (!args[0]) return m.reply(`⚠️ أدخل اسم مستخدم انستغرام\n\n*• مثال:* ${usedPrefix + command} GataDios`)
m.react("⌛");
try {
const apiUrl = `${info.apis}/tools/igstalk?username=${encodeURIComponent(args[0])}`;
const apiResponse = await fetch(apiUrl);
const delius = await apiResponse.json();
if (!delius || !delius.data) return m.react("❌");
const profile = delius.data;
const txt = `👤 *ملف تعريف انستغرام*:
🔹 *اسم المستخدم*: ${profile.username}
🔹 *الاسم الكامل*: ${profile.full_name}
🔹 *السيرة الذاتية*: ${profile.biography}
🔹 *موثق*: ${profile.verified ? 'نعم' : 'لا'}
🔹 *حساب خاص*: ${profile.private ? 'نعم' : 'لا'}
🔹 *المتابعون*: ${profile.followers}
🔹 *يتابع*: ${profile.following}
🔹 *المنشورات*: ${profile.posts}
🔹 *الرابط*: ${profile.url}`;

await conn.sendFile(m.chat, profile.profile_picture, 'insta_profile.jpg', txt, m);
 m.react("✅");
} catch (e2) {
try {     
let res = await fg.igStalk(args[0])
let te = `👤 *ملف تعريف انستغرام*:
*• الاسم:* ${res.name} 
*• اسم المستخدم:* ${res.username}
*• المتابعون:* ${res.followersH}
*• يتابع:* ${res.followingH}
*• السيرة الذاتية:* ${res.description}
*• المنشورات:* ${res.postsH}
*• الرابط* : https://instagram.com/${res.username.replace(/^@/, '')}`
await conn.sendFile(m.chat, res.profilePic, 'igstalk.png', te, m)
m.react("⌛");     
} catch (e) {
await m.react(`❌`) 
m.reply(`\`\`\`⚠️ حدث خطأ ⚠️\`\`\`\n\n> *أبلغ المطور بالخطأ التالي باستخدام الأمر:*#report\n\n>>> ${e} <<<< `)       
console.log(e)
}}}
handler.help = ['igstalk']
handler.tags = ['downloader']
handler.command = ['igstalk', 'igsearch', 'instagramsearch', 'بحث-انستا'] 
handler.register = true
handler.limit = 1
export default handler
