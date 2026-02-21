const handler = async (m, { conn, usedPrefix }) => {
    // تحديد المستخدم المستهدف
    const who = m.quoted?.sender || m.mentionedJid?.[0] || m.sender;

    try {
        // جلب بيانات المستخدم من قاعدة البيانات
        const res = await m.db.query("SELECT limite, exp, money, banco FROM usuarios WHERE id = $1", [who]);
        const user = res.rows[0];

        // التحقق مما إذا كان المستخدم موجودًا
        if (!user) {
            const target = who === m.sender ? 'أنت غير مسجل' : 'هذا المستخدم غير مسجل';
            throw `✳️ ${target}. استخدم \`${usedPrefix}تسجيل\` للبدء.`;
        }

        // بناء رسالة الرصيد
        const balanceMessage = `
*╭─── • 「 رصيدك الحالي 」 • ───╮*
│
│ 👤 *@${who.split('@')[0]}* لديك:
│ 
│ *﹝محفظتك﹞*
│ 💎 *الماس:* ${user.limite || 0}
│ ✨ *الخبرة:* ${user.exp || 0}
│ 🪙 *الكوينز:* ${user.money || 0}
│
│ *﹝حسابك البنكي﹞*
│ 🏦 *الرصيد:* ${user.banco || 0} ماسات
│
*╰─── • 「                  」 • ───╯*

> *ملاحظة:*
> يمكنك شراء الماس 💎 باستخدام الأوامر:
> • ${usedPrefix}شراء <الكمية>
> • ${usedPrefix}شراء_الكل
        `.trim();

        await conn.reply(m.chat, balanceMessage, m, { mentions: [who] });

    } catch (error) {
        console.error(error);
        // إرسال رسالة الخطأ المخصصة أو رسالة خطأ عامة
        const errorMessage = typeof error === 'string' ? error : '❌ حدث خطأ أثناء جلب الرصيد.';
        await m.reply(errorMessage);
    }
};

handler.help = ['رصيدي', 'محفظتي'];
handler.tags = ['economy']; // تم تغيير الوسم إلى economy ليتناسب مع المحتوى
handler.command = ['bal', 'diamantes', 'diamond', 'balance', 'رصيدي', 'بنك', 'محفظتي'];
handler.register = true;

export default handler;
