import moment from 'moment-timezone';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const userResult = await m.db.query('SELECT registered FROM usuarios WHERE id = $1', [m.sender]);
    const isRegistered = userResult.rows[0]?.registered;

    if (!isRegistered) {
        return m.reply(`⚠️ *أنت غير مسجل بعد.*\nاستخدم الأمر \`${usedPrefix}تسجيل اسمك.عمرك\` للتسجيل.`);
    }

    switch (command) {
        case 'setgenero':
        case 'تعديل_الجنس':
            const gender = text.trim().toLowerCase();
            if (!['ذكر', 'أنثى'].includes(gender)) {
                return m.reply(`✳️ *الاستخدام:*\n${usedPrefix}تعديل_الجنس <ذكر|أنثى>`);
            }
            try {
                await m.db.query('UPDATE usuarios SET gender = $1 WHERE id = $2', [gender, m.sender]);
                m.reply(`✅ *تم تحديث جنسك إلى:* ${gender}`);
            } catch (e) {
                console.error(e);
                m.reply('❌ حدث خطأ أثناء تحديث بياناتك.');
            }
            break;

        case 'setbirthday':
        case 'تعديل_الميلاد':
            const birthday = text.trim();
            if (!birthday) {
                return m.reply(`✳️ *الاستخدام:*\n${usedPrefix}تعديل_الميلاد <يوم/شهر/سنة>\n*مثال:* ${usedPrefix}تعديل_الميلاد 30/10/2000\nلإزالته، اكتب: ${usedPrefix}تعديل_الميلاد حذف`);
            }

            if (birthday.toLowerCase() === 'حذف') {
                try {
                    await m.db.query('UPDATE usuarios SET birthday = NULL WHERE id = $1', [m.sender]);
                    return m.reply('✅ *تم حذف تاريخ ميلادك بنجاح.*');
                } catch (e) {
                    console.error(e);
                    return m.reply('❌ حدث خطأ أثناء حذف البيانات.');
                }
            }

            try {
                const date = moment(birthday, 'DD/MM/YYYY', true);
                if (!date.isValid()) {
                    throw new Error('invalid format');
                }
                await m.db.query('UPDATE usuarios SET birthday = $1 WHERE id = $2', [date.format('YYYY-MM-DD'), m.sender]);
                m.reply(`✅ *تم حفظ تاريخ ميلادك:* ${birthday}`);
            } catch (e) {
                m.reply('❌ تنسيق تاريخ غير صالح. يرجى استخدام \`DD/MM/YYYY\` (يوم/شهر/سنة).');
            }
            break;
    }
};

handler.help = ['تعديل_الجنس <ذكر|أنثى>', 'تعديل_الميلاد <يوم/شهر/سنة>'];
handler.tags = ['rpg'];
handler.command = /^(setgenero|تعديل_الجنس|setbirthday|تعديل_الميلاد)$/i;

export default handler;
