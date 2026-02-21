import { db } from '../lib/postgres.js';

const handler = async (m, { args, command, conn, text }) => {
    const commandMap = {
        'setwelcome': 'الترحيب', 'تخصيص_الترحيب': 'الترحيب',
        'setbye': 'الوداع', 'تخصيص_الوداع': 'الوداع',
        'setpromote': 'الترقية', 'تخصيص_الترقية': 'الترقية',
        'setdemote': 'التخفيض', 'تخصيص_التخفيض': 'التخفيض'
    };

    const type = commandMap[command];
    if (!type) return;

    if (!text) {
        const variables = [
            '@user ← الإشارة إلى المستخدم',
            ...(type === 'الترحيب' || type === 'الوداع' ? ['@group ← اسم المجموعة'] : []),
            ...(type === 'الترحيب' ? ['@desc ← وصف المجموعة'] : []),
            ...(type === 'الترقية' || type === 'التخفيض' ? ['@author ← الشخص الذي قام بالإجراء'] : [])
        ].join('\n• ');

        const options = (type === 'الترحيب' || type === 'الوداع') ? `*خيارات إضافية:*\n• --صورة ← لإرسال الرسالة مع صورة\n• --نص_فقط ← لإرسال نص فقط` : '';

        const examples = {
            'الترحيب': 'أهلاً @user، مرحباً بك في @group. الرجاء قراءة القوانين: @desc',
            'الوداع': 'وداعاً @user، شكراً لانضمامك إلى @group.',
            'الترقية': 'تمت ترقية @user بواسطة @author.',
            'التخفيض': 'تم تخفيض رتبة @user بواسطة @author.'
        };

        const example = examples[type];

        const arabicCommand = Object.keys(commandMap).find(key => commandMap[key] === type && key.includes('_'));
        const finalCommand = arabicCommand || command;

        return m.reply(
            `*⚙️ قم بتخصيص رسالة ${type} للمجموعة:*\n\n` +
            `*يمكنك استخدام المتغيرات التالية:*\n• ${variables}\n${options}\n\n` +
            `*مثال على الاستخدام:*\n➤ /${finalCommand} ${example} --صورة`
        );
    }

    const hasPhoto = text.includes('--صورة');
    const hasNoPhoto = text.includes('--نص_فقط');
    const cleanText = text.replace('--صورة', '').replace('--نص_فقط', '').trim();

    await db.query(`INSERT INTO group_settings (group_id) VALUES ($1) ON CONFLICT DO NOTHING`, [m.chat]);

    const successMessages = {
        'الترحيب': `✅ تم حفظ رسالة الترحيب${hasPhoto ? ' مع صورة' : hasNoPhoto ? ' بدون صورة' : ''}.`,
        'الوداع': `✅ تم حفظ رسالة الوداع${hasPhoto ? ' مع صورة' : hasNoPhoto ? ' بدون صورة' : ''}.`,
        'الترقية': "✅ تم حفظ رسالة الترقية.",
        'التخفيض': "✅ تم حفظ رسالة التخفيض."
    };

    const queries = {
        'الترحيب': `UPDATE group_settings SET swelcome = $1${hasPhoto ? ', photowelcome = true' : ''}${hasNoPhoto ? ', photowelcome = false' : ''} WHERE group_id = $2`,
        'الوداع': `UPDATE group_settings SET sbye = $1${hasPhoto ? ', photobye = true' : ''}${hasNoPhoto ? ', photobye = false' : ''} WHERE group_id = $2`,
        'الترقية': `UPDATE group_settings SET spromote = $1 WHERE group_id = $2`,
        'التخفيض': `UPDATE group_settings SET sdemote = $1 WHERE group_id = $2`
    };

    await db.query(queries[type], [cleanText, m.chat]);
    return m.reply(successMessages[type]);
};

handler.help = ['تخصيص_الترحيب <نص>', 'تخصيص_الوداع <نص>', 'تخصيص_الترقية <نص>', 'تخصيص_التخفيض <نص>'];
handler.tags = ['group'];
handler.command = ['setwelcome', 'setbye', 'setpromote', 'setdemote', 'تخصيص_الترحيب', 'تخصيص_الوداع', 'تخصيص_الترقية', 'تخصيص_التخفيض'];
handler.group = true;
handler.admin = true;
handler.register = true;

export default handler;
