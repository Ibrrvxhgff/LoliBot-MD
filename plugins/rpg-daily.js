const free = 5000; // الخبرة الأساسية
const expIncrease = 1000; // زيادة الخبرة لكل يوم في السلسلة
const bonusExp = 10000; // خبرة إضافية كمكافأة أسبوعية
const bonusLimit = 10; // ماسات إضافية كمكافأة أسبوعية
const bonusMoney = 5000; // كوينز إضافية كمكافأة أسبوعية

// دالة لتحويل الميلي ثانية إلى ساعات ودقائق باللغة العربية
function msToTime(duration) {
    const totalSeconds = Math.floor(Math.max(0, duration) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} ساعة و ${minutes} دقيقة`;
}

// دالة لتنسيق الأرقام الكبيرة
function formatNumber(num) {
    return num.toLocaleString('en-US');
}

const handler = async (m, { conn, usedPrefix }) => {
    const now = Date.now();
    const res = await m.db.query("SELECT exp, limite, money, lastclaim, dailystreak FROM usuarios WHERE id = $1", [m.sender]);
    const user = res.rows[0];

    if (!user) {
        return m.reply(`⚠️ أنت غير مسجل. استخدم الأمر \`${usedPrefix}تسجيل\` للبدء.`);
    }

    const lastClaim = Number(user.lastclaim) || 0;
    const streak = Number(user.dailystreak) || 0;
    const claimCooldown = 86400000; // 24 ساعة
    const nextClaimTime = lastClaim + claimCooldown;
    const timeRemaining = Math.max(0, nextClaimTime - now);

    if (timeRemaining > 0) {
        return m.reply(`⚠️ لقد طالبت بمكافأتك اليومية بالفعل.\n🎁 عد بعد *${msToTime(timeRemaining)}* للمطالبة مرة أخرى.`);
    }

    // تحديد استمرارية السلسلة (إذا مر أقل من 48 ساعة)
    const newStreak = (now - lastClaim < claimCooldown * 2) ? streak + 1 : 1;
    const currentExp = free + (newStreak - 1) * expIncrease;
    const nextExp = currentExp + expIncrease;

    let bonusText = "";
    try {
        // التحقق من المكافأة الأسبوعية (كل 7 أيام)
        if (newStreak > 0 && newStreak % 7 === 0) {
            await m.db.query(`
                UPDATE usuarios 
                SET exp = exp + $1, limite = limite + $2, money = money + $3, lastclaim = $4, dailystreak = $5
                WHERE id = $6
            `, [currentExp + bonusExp, bonusLimit, bonusMoney, now, newStreak, m.sender]);

            bonusText = `
*🎉 مكافأة السلسلة الأسبوعية! 🎉*
> +${formatNumber(bonusExp)} خبرة إضافية
> +${bonusLimit} 💎 ماسات
> +${formatNumber(bonusMoney)} 🪙 كوينز
`;
        } else {
            await m.db.query(`
                UPDATE usuarios 
                SET exp = exp + $1, lastclaim = $2, dailystreak = $3
                WHERE id = $4
            `, [currentExp, now, newStreak, m.sender]);
        }

        const replyMessage = `
*╭─── • 「 مكافأتك اليومية 」 • ───╮*
│
│ ✅ *لقد حصلت على:* ${formatNumber(currentExp)} خبرة
│ 🔥 *سلسلة الدخول:* اليوم ${newStreak}
│
${bonusText ? `│${bonusText.replace(/\n/g, '\n│ ')}` : ''}*╰─── • 「                  」 • ───╯*

> ✨ *لا تنسَ المطالبة غدًا للحصول على ${formatNumber(nextExp)} خبرة!*`;

        await m.reply(replyMessage.trim());

    } catch (e) {
        console.error('Daily Claim Error:', e);
        m.reply('❌ حدث خطأ أثناء المطالبة بالمكافأة. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['يومي', 'راتب'];
handler.tags = ['economy'];
handler.command = ['daily', 'claim', 'يومي', 'راتب', 'مطالبة'];
handler.register = true;

export default handler;
