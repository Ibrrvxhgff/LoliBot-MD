const transferConfig = {
    exp: { name: 'خبرة ✨' },
    money: { name: 'كوينز 🪙' },
    limite: { name: 'ماس 💎' },
};
const transferableItems = Object.keys(transferConfig);

// لتخزين طلبات التأكيد المؤقتة
const confirmation = {};

async function handler(m, { conn, args, usedPrefix, command }) {
    if (confirmation[m.sender]) {
        return m.reply('⏳ أنت تقوم بالفعل بعملية تحويل. يرجى إكمالها أو إلغاؤها أولاً.');
    }

    const type = (args[0] || '').toLowerCase();
    const countStr = args[1];
    const who = m.mentionedJid?.[0] || m.quoted?.sender || (args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '');

    if (!transferableItems.includes(type) || !countStr || !who) {
        let helpText = `*🔄 نظام التحويل 🔄*\n\nحوّل الموارد إلى مستخدمين آخرين.\n\n*الاستخدام:*\n*${usedPrefix + command} [النوع] [الكمية] [@منشن]*\n\n*مثال:*\n*${usedPrefix + command} خبرة 100 @مستخدم*\n\n*الموارد المتاحة للتحويل:*\n`;
        helpText += Object.entries(transferConfig).map(([key, { name }]) => `> • *${key}* (${name})`).join('\n');
        return m.reply(helpText, m.chat, { mentions: conn.parseMention(helpText) });
    }

    const count = parseInt(countStr);
    if (isNaN(count) || count <= 0) {
        return m.reply('⚠️ يرجى إدخال كمية صحيحة أكبر من الصفر.');
    }

    const client = await m.db.connect();
    try {
        await client.query('BEGIN');

        const senderRes = await client.query('SELECT * FROM usuarios WHERE id = $1 FOR UPDATE', [m.sender]);
        const receiverRes = await client.query('SELECT * FROM usuarios WHERE id = $1 FOR UPDATE', [who]);
        const senderUser = senderRes.rows[0];
        const receiverUser = receiverRes.rows[0];

        if (!receiverUser) {
            await client.query('ROLLBACK');
            return m.reply(`⚠️ المستخدم @${who.split('@')[0]} غير مسجل.`, null, { mentions: [who] });
        }
        if (m.sender === who) {
            await client.query('ROLLBACK');
            return m.reply(`❌ لا يمكنك التحويل إلى نفسك.`);
        }
        if ((senderUser[type] || 0) < count) {
            await client.query('ROLLBACK');
            return m.reply(`⚠️ ليس لديك ما يكفي من *${transferConfig[type].name}* لإتمام هذا التحويل.`);
        }

        const arabicTypeName = transferConfig[type].name;
        let confirmText = `*🔒 تأكيد عملية التحويل 🔒*\n\nأنت على وشك تحويل:\n*• الكمية:* ${count.toLocaleString()} ${arabicTypeName}\n*• إلى:* @${who.split('@')[0]}\n\n*هل تريد المتابعة؟*\nلديك 30 ثانية للرد.\n\n> اكتب *نعم* للتأكيد.\n> اكتب *لا* للإلغاء.`;

        await conn.reply(m.chat, confirmText, m, { mentions: [who] });

        confirmation[m.sender] = {
            sender: m.sender,
            to: who,
            type,
            count,
            timeout: setTimeout(() => {
                if (confirmation[m.sender]) {
                    m.reply('⏰ انتهى الوقت. تم إلغاء عملية التحويل.');
                    delete confirmation[m.sender];
                }
            }, 30 * 1000),
            client, // نحتفظ بالعميل لاستخدامه في التأكيد
        };

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Transfer initiation error:', e);
        m.reply('❌ حدث خطأ أثناء بدء التحويل. يرجى المحاولة مرة أخرى.');
        client.release();
    }
}

handler.before = async (m, { conn }) => {
    if (!confirmation[m.sender] || m.isBaileys || m.sender !== confirmation[m.sender].sender) return;

    const { sender, to, type, count, timeout, client } = confirmation[m.sender];
    const userResponse = m.text.trim().toLowerCase();

    if (userResponse !== 'نعم' && userResponse !== 'لا') return;

    clearTimeout(timeout);
    delete confirmation[sender];

    try {
        if (userResponse === 'نعم') {
            await client.query(`UPDATE usuarios SET ${type} = ${type} - $1 WHERE id = $2`, [count, sender]);
            await client.query(`UPDATE usuarios SET ${type} = ${type} + $1 WHERE id = $2`, [count, to]);
            await client.query('COMMIT');

            const arabicTypeName = transferConfig[type].name;
            conn.reply(m.chat, `✅ *تم التحويل بنجاح!*\n\n*• تم إرسال:* ${count.toLocaleString()} ${arabicTypeName}\n*• إلى:* @${to.split('@')[0]}`, m, { mentions: [to] });
        } else { // userResponse === 'لا'
            await client.query('ROLLBACK');
            m.reply('❌ تم إلغاء عملية التحويل.');
        }
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Transfer confirmation error:', e);
        m.reply('❌ حدث خطأ أثناء تأكيد التحويل. لم يتم تحويل أي شيء.');
    } finally {
        client.release();
    }
};

handler.help = ['تحويل [النوع] [الكمية] [@منشن]'];
handler.tags = ['rpg'];
handler.command = ['transfer', 'dar', 'enviar', 'transferir', 'تحويل', 'نقل', 'ارسال'];
handler.register = true;
handler.group = true; // لضمان عمله في المجموعات

export default handler;
