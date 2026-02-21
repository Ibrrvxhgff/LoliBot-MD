import { db } from '../lib/postgres.js';

const handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {

    // Command to clear AI memory
    if (['clearmemory', 'clearai', 'resetai', 'مسح_الذاكرة'].includes(command)) {
        try {
            await db.query('DELETE FROM chat_memory WHERE chat_id = $1', [m.chat]);
            return m.reply('🧠 تم مسح ذاكرة الدردشة بنجاح. سيبدأ البوت محادثة جديدة.');
        } catch (e) {
            console.error(e);
            return m.reply('❌ حدث خطأ أثناء مسح الذاكرة. حاول مرة أخرى.');
        }
    }

    // Command to set memory TTL
    if (['memttl', 'timeia', 'وقت_الذاكرة'].includes(command)) {
        if (!isOwner) {
            return m.reply('⛔ هذه الميزة مخصصة للمالك فقط.');
        }
        if (!text) {
            let helpMessage = `⏱️ *الاستخدام:* ${usedPrefix + command} 10m | 2h | 1d | 0\n`;
            helpMessage += 'الوحدات المتاحة: s (ثواني), m (دقائق), h (ساعات), d (أيام)\n';
            helpMessage += `*أمثلة:*\n`;
            helpMessage += `${usedPrefix + command} 30m      → يتم مسح الذاكرة بعد 30 دقيقة من عدم النشاط\n`;
            helpMessage += `${usedPrefix + command} 2h       → ساعتان\n`;
            helpMessage += `${usedPrefix + command} 0        → يتم مسح الذاكرة بعد كل رسالة (تعطيل الذاكرة المستمرة)`;
            return m.reply(helpMessage);
        }

        try {
            if (text === '0') {
                await db.query('UPDATE group_settings SET memory_ttl = 0 WHERE group_id = $1', [m.chat]);
                return m.reply('🧠 تم تعطيل الذاكرة المستمرة. سيستجيب البوت بدون سياق للرسائل السابقة.');
            }

            const match = text.match(/^(\d+)([smhd])$/i);
            if (!match) {
                return m.reply('❌ تنسيق غير صالح. استخدم: 10m, 2h, 1d');
            }

            const num = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            const unitToSeconds = { s: 1, m: 60, h: 3600, d: 86400 };
            const seconds = num * unitToSeconds[unit];

            await db.query('UPDATE group_settings SET memory_ttl = $1 WHERE group_id = $2', [seconds, m.chat]);
            return m.reply(`✅ تم تحديث مدة صلاحية الذاكرة إلى *${num}${unit}* (تعادل ${seconds} ثانية).`);
        } catch (e) {
            console.error(e);
            return m.reply('❌ حدث خطأ أثناء تحديث مدة صلاحية الذاكرة.');
        }
    }
};

handler.help = ['مسح_الذاكرة', 'وقت_الذاكرة [الوقت]'];
handler.tags = ['ai', 'group'];
handler.command = ['clearmemory', 'clearai', 'resetai', 'مسح_الذاكرة', 'memttl', 'timeia', 'وقت_الذاكرة'];
handler.group = true;
handler.admin = true; // Admin can clear memory, but only owner can set TTL

export default handler;
