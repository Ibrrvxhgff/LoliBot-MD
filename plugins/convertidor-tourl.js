import uploadFile, { quax, RESTfulAPI, catbox, uguu, filechan, pixeldrain, gofile, krakenfiles, telegraph } from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import fetch from "node-fetch";
import FormData from "form-data";

const handler = async (m, { args, usedPrefix, command }) => {
const q = m.quoted ? m.quoted : m;
const mime = (q.msg || q).mimetype || "";

if (!mime) throw `*⚠️ أين الصورة/الفيديو؟*

*• مثال على استخدام ${usedPrefix + command}:*

➔ قم بالرد على صورة، ملصق، أو فيديو قصير بالأمر: *${usedPrefix + command}*

سيقوم برفع الملف تلقائيًا إلى خوادم مثل *qu.ax*، *catbox*، *cdn-skyultraplus*، إلخ.

🌐 *هل تريد اختيار خادم معين؟*
> يمكنك استخدام:

➔ *${usedPrefix + command} quax*  
➔ *${usedPrefix + command} catbox*  
➔ *${usedPrefix + command} sky*
➔ *${usedPrefix + command} uguu*  
➔ *${usedPrefix + command} restfulapi*  
➔ *${usedPrefix + command} gofile*  
➔ *${usedPrefix + command} telegraph*  

📝 *ملاحظات:*
- *يجب أن يكون الملف صورة أو ملصقًا أو مقطع فيديو قصيرًا.*  
- *روابط qu.ax و catbox لا تنتهي صلاحيتها.*
- *شبكة توصيل المحتوى (CDN) الخاصة بـ SkyUltraPlus ليس لها تاريخ انتهاء صلاحية وهي أسرع (مدفوعة)، يمكنك الحصول على مزيد من المعلومات هنا:* https://cdn.skyultraplus.com`;

const media = await q.download();
if (!media) throw "❌ تعذر تنزيل الملف.";
const option = (args[0] || "").toLowerCase();
const services = { quax, restfulapi: RESTfulAPI, catbox, uguu, filechan, pixeldrain, gofile, krakenfiles, telegraph };
try {
if (option === "sky") {
let ext = mime.split("/")[1] || "jpg";
if (ext === "jpeg") ext = "jpg";
const form = new FormData();
form.append("name", "archivo_bot");
form.append("file", media, {
filename: `upload.${ext}`,
contentType: mime,
});

const res = await fetch("https://cdn.skyultraplus.com/upload.php", {
method: "POST",
headers: {
...form.getHeaders(),
"X-API-KEY": "4aef4a55e558",
},
body: form,
});
const json = await res.json().catch(() => ({}));
if (!json.ok) throw `Status: ${res.status}\nerror: ${JSON.stringify(json)}`;
const link = json.file?.url || json.url;
return m.reply(link);
}
    
if (option && services[option]) {
const link = await services[option](media);
return m.reply(link);
}

const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
const link = await (isTele ? uploadImage : uploadFile)(media);
return m.reply(link);
} catch (e) {
console.error(e);
throw '❌ خطأ في رفع الملف. جرب خيارًا آخر:\n' + Object.keys(services).concat(["skyultra"]).map(v => `➔ ${usedPrefix}${command} ${v}`).join('\n');
}};
handler.help = ['tourl <opcional servicio>'];
handler.tags = ['convertidor'];
handler.command = /^(upload|tourl|رفع)$/i;
handler.register = true;

export default handler;
