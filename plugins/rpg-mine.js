const cooldown = 600000; // 10 دقائق

// قائمة رسائل التعدين العشوائية باللغة العربية
const mineMessages = [
    '⛏️ عمل رائع! لقد قمت بتعدين',
    '🌟✨ ممتاز! لقد حصلت على',
    '🤩 واو! أنت عامل منجم ماهر ⛏️ لقد حصلت على',
    'لقد نجحت في التعدين وحصلت على',
    '😲 تمكنت من تعدين كمية من',
    'ستزداد ثروتك بفضل ما قمت بتعدينه، وهو',
    '⛏️ جاري التعدين... بنجاح! لقد حصلت على',
    '🎉 تهانينا! الآن لديك',
    '🛣️ لقد عثرت على كهف جديد، وبتعدينك فيه حصلت على',
    '♻️ اكتملت مهمتك بنجاح، لقد عدّنت',
];

// دالة لتحويل الميلي ثانية إلى دقائق وثواني
function msToTime(duration) {
    const totalSeconds = Math.floor(Math.max(0, duration) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} دقيقة و ${seconds} ثانية`;
}

// دالة لاختيار رسالة عشوائية
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// دالة لتنسيق الأرقام
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

const handler = async (m, { conn, usedPrefix }) => {
    const now = Date.now();

    try {
        const userRes = await m.db.query("SELECT exp, lastmiming FROM usuarios WHERE id = $1", [m.sender]);
        const user = userRes.rows[0];

        if (!user) {
            return m.reply(`⚠️ أنت غير مسجل. استخدم الأمر \`${usedPrefix}تسجيل\` للبدء.`);
        }

        const lastMine = Number(user.lastmiming) || 0;
        const nextMineTime = lastMine + cooldown;
        const remainingTime = Math.max(0, nextMineTime - now);

        if (remainingTime > 0) {
            return m.reply(`⏳ يجب أن تنتظر *${msToTime(remainingTime)}* قبل أن تتمكن من التعدين مرة أخرى.`);
        }

        const amountGained = Math.floor(Math.random() * 6000) + 500; // ربح بين 500 و 6500

        await m.db.query(`UPDATE usuarios SET exp = exp + $1, lastmiming = $2 WHERE id = $3`, [amountGained, now, m.sender]);

        const message = pickRandom(mineMessages);
        m.reply(`${message} *${formatNumber(amountGained)}* خبرة ✨`);

    } catch (e) {
        console.error('Mine command error:', e);
        m.reply('❌ حدث خطأ أثناء محاولة التعدين. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['تعدين'];
handler.tags = ['economy'];
handler.command = ['minar', 'miming', 'mine', 'تعدين'];
handler.register = true;

export default handler;
