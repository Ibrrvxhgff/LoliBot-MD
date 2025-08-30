import { canLevelUp } from '../lib/levelling.js'

const multiplier = 650

export async function before(m, { conn }) {
    // التحقق من إعدادات المجموعة
    const chatres = await m.db.query('SELECT autolevelup FROM group_settings WHERE group_id = $1', [m.chat])
    const chat = chatres.rows[0]
    if (!chat?.autolevelup) return
    
    // جلب بيانات المستخدم
    const res = await m.db.query('SELECT exp, level, role FROM usuarios WHERE id = $1', [m.sender])
    const user = res.rows[0]

    // حساب المستوى الجديد
    const previousLevel = user.level
    let currentLevel = user.level
    while (canLevelUp(currentLevel, user.exp, multiplier)) {
        currentLevel++
    }

    // إذا كان هناك ترقية في المستوى
    if (currentLevel > previousLevel) {
        const newRole = getRole(currentLevel).name
        await m.db.query('UPDATE usuarios SET level = $1, role = $2 WHERE id = $3', [currentLevel, newRole, m.sender])
        user.level = currentLevel
        user.role = newRole

        // إرسال رسالة تهنئة
        conn.reply(m.chat, [`*「 تهانينا، لقد ارتفع مستواك 🆙🥳 」*\n\nتهانينا، لقد ارتفع مستواك، استمر في التقدم 👏\n\n*• المستوى السابق:* ${previousLevel} ⟿ ${user.level}\n*• الرتبة:* ${user.role}\n\n*لمشاهدة نقاط خبرتك الحالية، اكتب الأمر #level*`, `@${m.sender.split`@`[0]} يا له من محترف! لقد وصلت إلى المستوى التالي\n*• المستوى:* ${previousLevel} ⟿ ${user.level}\n\n*لمعرفة من هو في القمة، اكتب الأمر #lb*`, `كم أنت رائع يا @${m.sender.split`@`[0]}! لقد وصلت إلى مستوى جديد 🙌\n\n*• المستوى الجديد:* ${user.level}\n*• المستوى السابق:* ${previousLevel}\n`].getRandom(), m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: info.wm, body: ' 💫 𝐒𝐮𝐩𝐞𝐫 𝐁𝐨𝐭 𝐃𝐞 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 🥳 ', previewType: 0, thumbnail: m.pp, sourceUrl: info.md}}})
    }
}

// دالة تحديد الرتبة بناءً على المستوى
export function getRole(level) {
    const ranks = ['مبتدئ', 'متدرب', 'مستكشف', 'خبير', 'حديد', 'فضة', 'ذهب', 'أسطورة', 'نجمي', 'ماسي', 'أعلى نجمي', 'نخبة عالمية']
    const subLevels = ['V', 'IV', 'III', 'II', 'I']
    const roles = []

    let lvl = 0
    for (let rank of ranks) {
        for (let sub of subLevels) {
            roles.push({ level: lvl, name: `${rank} ${sub}` })
            lvl++
        }
    }

    return roles.reverse().find(r => level >= r.level) || { level, name: 'مبتدئ V' }
}
