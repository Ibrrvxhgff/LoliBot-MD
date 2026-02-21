import { db } from '../lib/postgres.js';
import fetch from 'node-fetch';

// ترجمة أسماء الشخصيات مع الإبقاء على المصادر الأصلية
const presets = {
  1: () => fetch('https://raw.githubusercontent.com/Skidy89/chat-gpt-jailbreak/main/Text.txt').then(r => r.text()),
  2: () => fetch('https://raw.githubusercontent.com/elrebelde21/ChinaMitzuki/master/src/text-chatgpt.txt').then(r => r.text()),
  3: () => 'تصرف كشخصية اسمها \"نرجس\"، أنت نرجسي ومتلاعب، لا تهتم بأحد، تتحدث بازدراء عن الآخرين، وتستخدم السخرية والتهكم. أنت لا تتبع القواعد وتحب إثارة الجدل. استخدم الكثير من العامية والمصطلحات غير الرسمية.',
  4: () => fetch('https://raw.githubusercontent.com/elrebelde21/LoliBot-MD/main/src/text-chatgpt.txt').then(r => r.text())
};

const prompt_name = {
  1: '💣 وضع الاختراق',
  2: '🇨🇳 شخصية صينية',
  3: '💅 شخصية نرجس',
  4: '🧠 ذكاء اصطناعي متعدد الشخصيات'
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const input = text?.trim().toLowerCase();

    if (!text) {
        let helpMessage = `📌 *استخدم الأمر كالتالي:*\n`;
        helpMessage += `${usedPrefix + command} 1  - ${prompt_name[1]}\n`;
        helpMessage += `${usedPrefix + command} 2  - ${prompt_name[2]}\n`;
        helpMessage += `${usedPrefix + command} 3  - ${prompt_name[3]}\n`;
        helpMessage += `${usedPrefix + command} 4  - ${prompt_name[4]}\n`;
        helpMessage += `${usedPrefix + command} نص من عندك - ✍️ لتحديد شخصية مخصصة\n`;
        helpMessage += `${usedPrefix + command} حذف - 🧹 لحذف الشخصية الحالية ومسح الذاكرة`;
        return m.reply(helpMessage);
    }

    const isPreset = ['1', '2', '3', '4'].includes(input);
    const isDelete = ['delete', 'borrar', 'حذف', 'مسح'].includes(input);
    
    try {
        if (isDelete) {
            await db.query(`UPDATE group_settings SET sAutorespond = NULL WHERE group_id = $1`, [m.chat]);
            await db.query('DELETE FROM chat_memory WHERE chat_id = $1', [m.chat]);
            return m.reply('🗑️ *تم حذف الشخصية بنجاح ومسح ذاكرة الدردشة.*');
        }

        const prompt = isPreset ? await presets[input]() : text;

        await db.query(`INSERT INTO group_settings (group_id, sAutorespond) VALUES ($1, $2) ON CONFLICT (group_id) DO UPDATE SET sAutorespond = $2`, [m.chat, prompt]);
        await db.query('DELETE FROM chat_memory WHERE chat_id = $1', [m.chat]);

        let successMessage = `✅ *تم تحديد الشخصية بنجاح.*\n💬 من الآن فصاعدًا، سيستخدم البوت الشخصية التي حددتها.\n🧠 تم مسح ذاكرة الدردشة لبدء محادثة جديدة.\n\n> *تذكر أن تقوم بالرد على رسائل البوت أو عمل منشن له (@${conn.user.id.split(':')[0]}) لكي يستجيب.*`;

        if (isPreset) {
             successMessage += `\n\n*الشخصية المحددة:* ${prompt_name[input]}`;
        }

        return m.reply(successMessage);

    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء تحديد الشخصية. حاول مرة أخرى.');
    }
};

handler.help = ['تحديد_الشخصية [رقم|نص|حذف]'];
handler.tags = ['ai', 'group'];
handler.command = /^setprompt|autorespond|تحديد_الشخصية|شخصية_البوت$/i;
handler.group = true;
handler.admin = true;

export default handler;
