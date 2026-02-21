const maxRobAmount = 3000;
const cooldown = 3600000; // 1 ساعة

// --- دالة مساعدة ---
function msToTime(duration) {
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours} ساعة و ${formattedMinutes} دقيقة`;
}

// --- المعالج الرئيسي ---
const handler = async (m, { conn, usedPrefix }) => {
    const now = Date.now();
    
    try {
        await m.db.query('BEGIN');

        const robberRes = await m.db.query('SELECT exp, lastrob FROM usuarios WHERE id = $1 FOR UPDATE', [m.sender]);
        const robber = robberRes.rows[0];

        if (!robber) {
            await m.db.query('ROLLBACK');
            return m.reply(`⚠️ أنت غير مسجل. استخدم الأمر \`${usedPrefix}تسجيل\` للبدء.`);
        }

        const timeLeft = (robber.lastrob || 0) + cooldown - now;
        if (timeLeft > 0) {
            await m.db.query('ROLLBACK');
            return m.reply(`🚓 الشرطة تراقبك، لا يمكنك السرقة الآن.\nعد بعد: *${msToTime(timeLeft)}*`);
        }

        let who;
        if (m.isGroup) {
            who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
        } else {
            who = m.chat;
        }

        if (!who) {
            await m.db.query('ROLLBACK');
            return conn.reply(m.chat, `⚠️ *منشن المستخدم الذي تريد سرقته.*`, m);
        }
        if (who === m.sender) {
            await m.db.query('ROLLBACK');
            return m.reply(`❌ لا يمكنك سرقة نفسك.`);
        }

        const victimRes = await m.db.query('SELECT exp FROM usuarios WHERE id = $1 FOR UPDATE', [who]);
        const victim = victimRes.rows[0];

        if (!victim) {
            await m.db.query('ROLLBACK');
            return m.reply(`❌ المستخدم الذي تحاول سرقته غير مسجل.`);
        }

        const amountToRob = Math.floor(Math.random() * maxRobAmount) + 1;

        if ((victim.exp || 0) < amountToRob) {
            await m.db.query('ROLLBACK');
            return conn.reply(m.chat, `@${who.split('@')[0]} لديه أقل من *${amountToRob.toLocaleString()}* خبرة.\n> لا تسرق الفقراء يا صديقي.`, m, { mentions: [who] });
        }

        // تنفيذ السرقة
        await m.db.query('UPDATE usuarios SET exp = exp + $1, lastrob = $2 WHERE id = $3', [amountToRob, now, m.sender]);
        await m.db.query('UPDATE usuarios SET exp = exp - $1 WHERE id = $2', [amountToRob, who]);
        
        await m.db.query('COMMIT');

        return conn.reply(m.chat, `*💰 لقد سرقت ${amountToRob.toLocaleString()} خبرة من @${who.split('@')[0]}*`, m, { mentions: [who] });

    } catch (e) {
        await m.db.query('ROLLBACK');
        console.error('Robbery error:', e);
        m.reply('❌ حدث خطأ أثناء محاولة السرقة. يرجى المحاولة مرة أخرى.');
    }
};

handler.help = ['سرقة @مستخدم'];
handler.tags = ['economy'];
handler.command = /^(robar|rob|سرقة|اسرق)$/i;
handler.register = true;
handler.group = true;
handler.cooldown = cooldown;

export default handler;
