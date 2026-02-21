import { googleImage } from '@bochilteam/scraper';
const handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return m.reply(`ما الذي تبحث عنه؟ 🤔️ استخدمه بالطريقة التالية\n• مثال\n*${usedPrefix + command} Loli*`) 
const forbiddenWords = ['براز', 'قضيب', 'إباحي', 'دموي', 'مني', 'عاهرة', 'لوطي', 'مؤخرة', 'مهبل', 'هنتai', 'قتل', 'بهيمية', 'عاري', 'عارية', 'أموات', 'بورنهاب', 'xnxx', 'xvideos', 'ثدي', 'sexmex', 'فurry', 'xxx', 'rule34', 'استغلال الأطفال جنسيا', 'جماع الموتى', 'شهواني', 'nsfw', 'femdom', 'futanari', 'جنس', 'yuri', 'ero', 'ecchi', 'مص', 'شرجي', 'ahegao', 'اغتصاب', 'bdsm', '+18', 'إباحية أطفال', 'ساخن', 'caca', 'polla', 'porno', 'porn', 'gore', 'cum', 'semen', 'puta', 'puto', 'culo', 'putita', 'putito','pussy', 'hentai', 'pene', 'coño', 'asesinato', 'zoofilia', 'mia khalifa', 'desnudo', 'desnuda', 'cuca', 'chocha', 'muertos', 'pornhub', 'xnxx', 'xvideos', 'teta', 'vagina', 'marsha may', 'misha cross', 'sexmex', 'furry', 'furro', 'furra', 'xxx', 'rule34', 'panocha', 'pedofilia', 'necrofilia', 'pinga', 'horny', 'ass', 'nude', 'popo', 'nsfw', 'femdom', 'futanari', 'erofeet', 'sexo', 'sex', 'yuri', 'ero', 'ecchi', 'blowjob', 'anal', 'ahegao', 'pija', 'verga', 'trasero', 'violation', 'violacion', 'bdsm', 'cachonda', '+18', 'cp', 'mia marin', 'lana rhoades', 'cepesito', 'hot', 'buceta', 'xxx', 'Violet Myllers', 'Violet Myllers pussy', 'Violet Myllers desnuda', 'Violet Myllers sin ropa', 'Violet Myllers culo', 'Violet Myllers vagina', 'Pornografía', 'Pornografía infantil', 'niña desnuda', 'niñas desnudas', 'niña pussy', 'niña pack', 'niña culo', 'niña sin ropa', 'niña siendo abusada', 'niña siendo abusada sexualmente' , 'niña cogiendo', 'niña fototeta', 'niña vagina', 'hero Boku no pico', 'Mia Khalifa cogiendo', 'Mia Khalifa sin ropa', 'Mia Khalifa comiendo polla', 'Mia Khalifa desnuda']
if (forbiddenWords.some(word => m.text.toLowerCase().includes(word))) return m.reply('🙄 لن أبحث عن حماقاتك....')
try {
const res = await googleImage(text);
const image = await res.getRandom();
const link = image;
conn.sendFile(m.chat, link, 'error.jpg', `_🔎 نتائج البحث عن: ${text}_`, m);
} catch (e) {
console.log(e);
}}
handler.help = ['gimage <query>', 'imagen <query>'];
handler.tags = ['buscadores'];
handler.command = /^(gimage|image|imagen|صورة)$/i;
handler.register = true;
handler.limit = 1;

export default handler;