import { createHash } from 'crypto';
import moment from 'moment-timezone';

// State object to manage registration steps for each user
const registrationState = {};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const userResult = await m.db.query('SELECT * FROM usuarios WHERE id = $1', [m.sender]);
    const user = userResult.rows[0] || { registered: false };

    if (user.registered) {
        return m.reply('✅ أنت مسجل بالفعل.');
    }

    if (registrationState[m.sender]?.step) {
        return m.reply('⏳ لديك عملية تسجيل قيد التقدم. يرجى إكمال الخطوة الحالية أولاً.');
    }

    const nameMatch = text.match(/^([^.]+)\.(\d+)$/);
    if (!nameMatch) {
        return m.reply(`*⚠️ تنسيق غير صحيح.*\nاستخدم الأمر كالتالي:\n*${usedPrefix + command} اسمك.عمرك*\n*مثال:* ${usedPrefix + command} أحمد.20`);
    }

    const [_, name, ageStr] = nameMatch;
    const age = parseInt(ageStr);

    if (!name) return m.reply('👤 يرجى إدخال اسمك.');
    if (name.length > 40) return m.reply('😅 اسمك طويل جدًا.');
    if (!age || isNaN(age)) return m.reply('🔢 يرجى إدخال عمر صحيح.');
    if (age > 100) return m.reply('👴 عمرك كبير جدًا.');
    if (age < 10) return m.reply('👦 يجب أن يكون عمرك 10 سنوات على الأقل.');

    registrationState[m.sender] = { step: 1, name, age, usedPrefix };

    await m.reply(`*📝 خطوة التسجيل (1/2)*\n\nما هو جنسك؟\n1. ذكر ♂️\n2. أنثى ♀️\n\n*يرجى الرد برقم (1 أو 2)*`);
};

handler.before = async (m, { conn }) => {
    const senderId = m.sender;
    const currentState = registrationState[senderId];

    if (!currentState || m.isBaileys || m.text.startsWith('/')) return;

    const input = m.text.trim();

    if (currentState.step === 1) {
        let gender;
        if (input === '1' || input.toLowerCase() === 'ذكر') {
            gender = 'ذكر';
        } else if (input === '2' || input.toLowerCase() === 'أنثى') {
            gender = 'أنثى';
        } else {
            return m.reply('⚠️ يرجى الرد بـ `1` للذكر أو `2` للأنثى.');
        }

        currentState.gender = gender;
        const { name, age, usedPrefix } = currentState;
        const serial = createHash('md5').update(senderId).digest('hex');
        const registrationTime = new Date();

        try {
            await m.db.query(`
                INSERT INTO usuarios (id, nombre, edad, gender, money, limite, exp, reg_time, registered, serial_number)
                VALUES ($1, $2, $3, $4, 500, 5, 200, $5, true, $6)
                ON CONFLICT (id) DO UPDATE
                SET nombre = $2, edad = $3, gender = $4, reg_time = $5, registered = true, serial_number = $6;
            `, [senderId, name, age, gender, registrationTime, serial]);

            const totalRegResult = await m.db.query(`SELECT COUNT(*) AS total FROM usuarios WHERE registered = true`);
            const totalRegistered = parseInt(totalRegResult.rows[0].total);

            let successMessage = `🎉 *[ ✅ تم التسجيل بنجاح ]* 🎉\n\n`;
            successMessage += `👤 *الاسم:* ${name}\n`;
            successMessage += `🔢 *العمر:* ${age} سنة\n`;
            successMessage += `젠 *الجنس:* ${gender}\n`;
            successMessage += `🕒 *وقت التسجيل:* ${moment(registrationTime).tz('Africa/Cairo').format('YYYY/MM/DD HH:mm:ss')}\n`;
            successMessage += `🔑 *الرقم التسلسلي:* ${serial}\n\n`;
            successMessage += `🎁 *مكافأة التسجيل:*\n   - 500 كوينز 🪙\n   - 5 ماسات 💎\n   - 200 خبرة ✨\n\n`;
            successMessage += `*استخدم الأمر* \`${usedPrefix}مساعدة\` *لرؤية قائمة الأوامر.*\n`;
            successMessage += `*إجمالي المستخدمين المسجلين:* ${totalRegistered}`;

            await m.reply(successMessage);

        } catch (e) {
            console.error("Registration Error:", e);
            await m.reply('❌ حدث خطأ أثناء عملية التسجيل. يرجى المحاولة مرة أخرى.');
        } finally {
            delete registrationState[senderId];
        }
    }
};

handler.help = ['تسجيل <اسمك.عمرك>'];
handler.tags = ['rpg'];
handler.command = /^(reg(ister)?|verificar|registrar|تسجيل|تسجيل_جديد)$/i;

export default handler;
