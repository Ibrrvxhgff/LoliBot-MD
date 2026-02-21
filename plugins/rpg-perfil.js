import moment from 'moment-timezone';
import { db } from '../lib/postgres.js';
import fetch from 'node-fetch';

// دالة لتنسيق رقم الهاتف وإعادته بصيغة دولية
const formatPhoneNumber = (jid) => {
  if (!jid) return 'غير معروف';
  const number = jid.replace('@s.whatsapp.net', '');
  if (!/^\d{8,15}$/.test(number)) return 'غير معروف';
  return `+${number}`;
};

let handler = async (m, { conn, usedPrefix }) => {
    // تحديد المستخدم المستهدف (صاحب الرسالة أو من تم عمل منشن له)
    let who = m.mentionedJid?.[0] || m.sender;

    try {
        // جلب بيانات المستخدم من قاعدة البيانات
        const userResult = await db.query('SELECT * FROM usuarios WHERE id = $1', [who]);
        const user = userResult.rows[0];

        // التحقق مما إذا كان المستخدم مسجلاً
        if (!user || !user.registered) {
            const target = who === m.sender ? 'أنت' : 'هذا المستخدم';
            return m.reply(`⚠️ *${target} غير مسجل ولا يمكن عرض ملفه الشخصي.*\nاستخدم الأمر \`${usedPrefix}تسجيل اسمك.عمرك\` للتسجيل.`);
        }

        // جلب بيانات إضافية من واتساب (الصورة والوصف)
        const bio = await conn.fetchStatus(who).catch(() => ({}));
        const userBio = bio.status || 'لا يوجد وصف';
        const profilePicUrl = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/9d38415096b6c46bf03f8.jpg');

        // استخراج بيانات المستخدم
        const { nombre, edad, limite, level, marry, gender, birthday } = user;
        const phoneNumber = formatPhoneNumber(who);

        // جلب جنسية المستخدم من واجهة برمجية خارجية
        let nationality = 'غير معروفة';
        try {
            const response = await fetch(`${global.info.apis}/tools/country?text=${phoneNumber.replace('+', '')}`);
            const data = await response.json();
            if (data?.result?.name) {
                nationality = `${data.result.name} ${data.result.emoji}`;
            }
        } catch (e) {
            console.warn('Nationality API error:', e);
        }

        // تحديد الحالة الاجتماعية
        let relationshipStatus = '💞 *الحالة:* عازب/ة';
        if (marry) {
            const partnerRes = await db.query('SELECT nombre FROM usuarios WHERE id = $1', [marry]);
            const partnerName = partnerRes.rows[0]?.nombre || 'شخص ما';
            relationshipStatus = `💍 *مرتبط/ة بـ:* ${partnerName.replace(/✓/g, '').trim()}`;
        }

        // بناء نص الملف الشخصي
        const profileText = `
*╭─── • 「 ملفك الشخصي 」 • ───╮*
│
│ 👤 *الاسم:* ${nombre.replace(/✓/g, '').trim()}
│ 📝 *الوصف:* ${userBio}
│ 🔗 *الرابط:* wa.me/${who.split('@')[0]}
│ 🌍 *الجنسية:* ${nationality}
│ 
│ ⚧️ *الجنس:* ${gender || 'غير محدد'}
│ 🎂 *الميلاد:* ${birthday ? moment(birthday).format('DD/MM/YYYY') : 'غير محدد'}
│ 🔢 *العمر:* ${edad ? `${edad} سنة` : 'غير محدد'}
│
│ 💎 *الماسات:* ${limite || 0}
│ 🌟 *المستوى:* ${level || 0}
│ ${relationshipStatus}
│ 
*╰─── • 「                  」 • ───╯*
        `.trim();

        await conn.sendFile(m.chat, profilePicUrl, 'profile.jpg', profileText, m);

    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء جلب الملف الشخصي. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['ملفي', 'بروفايل'];
handler.tags = ['rpg'];
handler.command = /^(perfil|profile|ملفي|بروفايل|ملف_شخصي)$/i;
handler.register = true;

export default handler;
