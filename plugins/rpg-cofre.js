const cooldown = 259200000; // 3 أيام

// --- دالة مساعدة لتحويل الوقت ---
function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    let timeString = "";
    if (days > 0) timeString += `${days} يوم `;
    if (hours > 0) timeString += `${hours} ساعة `;
    if (minutes > 0) timeString += `${minutes} دقيقة `;
    // if (seconds > 0) timeString += `${seconds} ثانية`; // يمكن إضافتها إذا أردت المزيد من الدقة

    return timeString.trim() || 'لحظات قليلة';
}

// --- المعالج الرئيسي ---
const handler = async (m, { conn, usedPrefix }) => {
    const now = Date.now();
    const client = await m.db.connect();

    try {
        await client.query('BEGIN');

        const userRes = await client.query("SELECT exp, money, limite, lastcofre FROM usuarios WHERE id = $1 FOR UPDATE", [m.sender]);
        const user = userRes.rows[0];

        if (!user) {
            await client.query('ROLLBACK');
            return m.reply(`⚠️ أنت غير مسجل. استخدم الأمر \`${usedPrefix}تسجيل\` للبدء.`);
        }

        const lastCofre = Number(user.lastcofre) || 0;
        const remainingTime = (lastCofre + cooldown) - now;

        if (remainingTime > 0) {
            await client.query('ROLLBACK');
            return m.reply(`🎁 لقد فتحت الصندوق بالفعل.\n\n⏳ عد بعد *${msToTime(remainingTime)}* للمحاولة مرة أخرى.`);
        }

        const diamonds = Math.floor(Math.random() * 30) + 10;  // 10-40
        const coins = Math.floor(Math.random() * 4000) + 1000; // 1000-5000
        const xp = Math.floor(Math.random() * 5000) + 2000; // 2000-7000

        await client.query(`UPDATE usuarios SET exp = exp + $1, money = money + $2, limite = limite + $3, lastcofre = $4 WHERE id = $5`, [xp, coins, diamonds, now, m.sender]);
        await client.query('COMMIT');

        const imageUrl = 'https://telegra.ph/file/abfa41a99f43f98218704.jpg'; // صورة جديدة لصندوق الكنز
        const caption = `
*🎉 لقد فتحت صندوق الكنز! 🎉*

*لقد حصلت على المكافآت التالية:*
> • *+${diamonds.toLocaleString()}* 💎 ماسات
> • *+${coins.toLocaleString()}* 🪙 كوينز
> • *+${xp.toLocaleString()}* ✨ خبرة
        `.trim();

        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption, mentions: [m.sender] }, { quoted: m });

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Cofre command error:', e);
        m.reply('❌ حدث خطأ أثناء فتح الصندوق. يرجى المحاولة مرة أخرى.');
    } finally {
        client.release();
    }
};

handler.help = ['صندوق'];
handler.tags = ['rpg'];
handler.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir', 'صندوق', 'فتح-صندوق'];
handler.level = 9; // يتطلب المستوى 9 لاستخدام الأمر
handler.register = true;

export default handler;
