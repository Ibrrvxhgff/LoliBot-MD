const COOLDOWN_DURATION = 180000; // 3 دقائق
const cooldowns = new Map();

const handler = async (m, { conn, args, usedPrefix }) => {
    const chatId = m.chat;
    const now = Date.now();

    const chatData = cooldowns.get(chatId) || { lastUsed: 0, rankingMessage: null };
    const timeLeft = COOLDOWN_DURATION - (now - chatData.lastUsed);

    if (timeLeft > 0) {
        const secondsLeft = Math.ceil(timeLeft / 1000);
        const minutes = Math.floor(secondsLeft / 60);
        const remainingSeconds = secondsLeft % 60;
        const timeMessage = minutes > 0
            ? `${minutes} دقيقة و ${remainingSeconds} ثانية`
            : `${remainingSeconds} ثانية`;

        await conn.reply(m.chat, `⚠️ يرجى الانتظار *${timeMessage}* قبل طلب لوحة المتصدرين مرة أخرى لتجنب الإزعاج.`, chatData.rankingMessage || m);
        return;
    }

    try {
        const res = await m.db.query('SELECT id, nombre, exp, limite, money, banco FROM usuarios');
        const users = res.rows.map(u => ({ ...u, jid: u.id }));

        const sortedExp = [...users].sort((a, b) => b.exp - a.exp);
        const sortedDiamond = [...users].sort((a, b) => b.limite - a.limite);
        const sortedMoney = [...users].sort((a, b) => b.money - a.money);
        const sortedBank = [...users].sort((a, b) => b.banco - a.banco);

        const topCount = args[0] ? Math.min(100, Math.max(parseInt(args[0]), 5)) : 10;

        const formatList = (list, prop, icon) =>
            list.slice(0, topCount).map(({ jid, [prop]: value }, i) =>
                `${i + 1}. @${jid.split('@')[0]}  *${formatNumber(value)}* ${icon}`
            ).join('\n');

        const userRank = (list) => list.findIndex(u => u.jid === m.sender) + 1;

        const text = `
*🏆 لوحة المتصدرين 🏆*

*🎯 أعلى ${topCount} بالخبرة ⚡*
> *أنت في المرتبة:* ${userRank(sortedExp)} من ${sortedExp.length}
${formatList(sortedExp, 'exp', '⚡')}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

*💎 أعلى ${topCount} بالماس 💎*
> *أنت في المرتبة:* ${userRank(sortedDiamond)} من ${sortedDiamond.length}
${formatList(sortedDiamond, 'limite', '💎')}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

*🪙 أعلى ${topCount} بالكوينز 🪙*
> *أنت في المرتبة:* ${userRank(sortedMoney)} من ${sortedMoney.length}
${formatList(sortedMoney, 'money', '🪙')}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

*🏦 أغنى ${topCount} في البنك 💵*
> *أنت في المرتبة:* ${userRank(sortedBank)} من ${sortedBank.length}
${formatList(sortedBank, 'banco', '💵')}
        `.trim();

        const rankingMessage = await m.reply(text, null, { mentions: conn.parseMention(text) });
        cooldowns.set(chatId, { lastUsed: now, rankingMessage });

    } catch (e) {
        console.error('Leaderboard Error:', e);
        m.reply('❌ حدث خطأ أثناء جلب لوحة المتصدرين. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['المتصدرين [العدد]'];
handler.tags = ['economy'];
handler.command = ['leaderboard', 'lb', 'top', 'ترتيب', 'المتصدرين', 'توب'];
handler.register = true;
handler.exp = 3500; // منح بعض الخبرة لاستخدام الأمر

export default handler;

// دالة لتنسيق الأرقام الكبيرة (مليون، ألف)
function formatNumber(num) {
    if (isNaN(num)) return '0';
    return num >= 1e6 ? (num / 1e6).toFixed(1) + 'م'  // مليون
         : num >= 1e3 ? (num / 1e3).toFixed(1) + 'ألف' // ألف
         : num.toString();
}
