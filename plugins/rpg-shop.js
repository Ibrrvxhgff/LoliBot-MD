const xpPerDiamond = 750;

const handler = async (m, { conn, command, args, usedPrefix }) => {
    try {
        const userRes = await m.db.query("SELECT exp, limite FROM usuarios WHERE id = $1", [m.sender]);

        if (userRes.rows.length === 0) {
            return m.reply(`⚠️ أنت غير مسجل. استخدم الأمر \`${usedPrefix}تسجيل\` أولاً.`);
        }
        const user = userRes.rows[0];

        // إذا لم يتم تقديم وسائط، اعرض قائمة المتجر
        if (!args[0] || args[0].trim() === '') {
            return m.reply(`
*🛒 متجر البوت 🛒*

مرحباً بك في المتجر! هنا يمكنك استبدال خبرتك بالماس.

*💎 سعر الصرف:*
*1* ماسة 💎 = *${xpPerDiamond.toLocaleString()}* خبرة ✨

*كيفية الشراء:*
• لشراء كمية محددة: \`${usedPrefix}شراء [الكمية]\`
  *مثال:* \`${usedPrefix}شراء 10\`

• لشراء كل ما يمكنك: \`${usedPrefix}شراء الكل\`
        `);
        }

        let count = 0;
        const isBuyAll = /all|الكل/i.test(args[0]);

        if (isBuyAll) {
            if (user.exp < xpPerDiamond) {
                return m.reply('⚠️ ليس لديك ما يكفي من الخبرة لشراء حتى ماسة واحدة.');
            }
            count = Math.floor(user.exp / xpPerDiamond);
        } else {
            const inputCount = parseInt(args[0]);
            if (isNaN(inputCount) || inputCount <= 0) {
                return m.reply('⚠️ يرجى إدخال عدد صحيح وموجب للكمية التي ترغب في شرائها.');
            }
            count = inputCount;
        }

        if (count === 0) {
            return m.reply('⚠️ الكمية المحددة أو خبرتك الحالية لا تسمح بشراء أي ماسة.');
        }

        const totalCost = xpPerDiamond * count;

        if (user.exp < totalCost) {
            return m.reply(`⚠️ ليس لديك ما يكفي من الخبرة لشراء *${count.toLocaleString()}* 💎 ماسة.\n> تحتاج إلى *${totalCost.toLocaleString()}* خبرة.\n> لديك حاليًا *${user.exp.toLocaleString()}* خبرة.`);
        }
        
        // بدء معاملة قاعدة البيانات
        await m.db.query('BEGIN');
        await m.db.query(`UPDATE usuarios SET exp = exp - $1, limite = limite + $2 WHERE id = $3`, [totalCost, count, m.sender]);
        await m.db.query('COMMIT');

        await m.reply(`
╔═════❖ *إيصال الشراء* ❖═════╗
║
║ ✅ *تم شراء:* ${count.toLocaleString()} 💎 ماسة
║ 💸 *التكلفة:* ${totalCost.toLocaleString()} خبرة
║
╚══════════════════════╝
        `);

    } catch (e) {
        // التراجع عن المعاملة في حالة حدوث خطأ
        await m.db.query('ROLLBACK').catch(err => console.error('Rollback failed:', err));
        console.error('Shop command error:', e);
        m.reply('❌ حدث خطأ أثناء عملية الشراء. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['متجر', 'شراء [الكمية]', 'شراء الكل'];
handler.tags = ['rpg'];
handler.command = /^(buy|shop|متجر|شراء)$/i;
handler.register = true;

export default handler;
