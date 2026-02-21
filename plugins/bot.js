
import baileys from '@whiskeysockets/baileys';
import moment from 'moment-timezone';

// دالة حساب الوقت الضرورية
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

const handler = async (m, { conn, usedPrefix: _p }) => {
    const { generateWAMessageFromContent, proto } = baileys;

    try {
        // جلب بيانات المستخدم من قاعدة البيانات
        const userRes = await m.db.query('SELECT * FROM usuarios WHERE id = $1', [m.sender]);
        const user = userRes.rows[0] || { level: 0, money: 0, role: 'Newbie', registered: false, nombre: m.pushName };
        const name = user.nombre || conn.getName(m.sender);

        // حساب وقت التشغيل
        const uptime = clockString(process.uptime() * 1000);
        
        // تنسيق التاريخ والوقت
        moment.locale('ar'); // تعيين اللغة العربية
        const tz = 'Asia/Jakarta';
        const date = moment().tz(tz).format('LL');
        const time = moment().tz(tz).format('LTS');

        // نص الرسالة
        const messageText = `*مـرحـبـا بـك يـا ${name}* 🕸️

*‹ معلومات النظام ›*
◦ *الـمـطـور:* إبراهيم
◦ *الـمـكـتـبـة:* Baileys
◦ *الـوقـت:* ${time}
◦ *الـتـاريخ:* ${date}
◦ *الـتـشـغـيـل:* ${uptime}

*‹ إحصائياتك ›*
◦ *الـلـفـل:* ${user.level || 0}
◦ *الـمـال:* ${user.money || 0}
◦ *الـرتبـة:* ${user.role || 'Newbie'}

*استخدم الأزرار بالأسفل للتنقل*`.trim();

        // بناء الرسالة التفاعلية
        const interactiveMessage = proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: messageText
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: "© 2026 | FATE SYSTEM ⚡"
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: "❪🌸┇فيت - FATE┇🍷❫",
                hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "⌈🚀╎الأوامر╎🚀⌋",
                            id: `${_p}menu`
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "⌈👤╎المطور╎👤⌋",
                            id: `${_p}owner`
                        })
                    }
                ]
            })
        });

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: { interactiveMessage }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'حدث خطأ في تشغيل أمر البوت، يرجى مراجعة السجلات', m);
    }
};

handler.help = ['bot'];
handler.tags = ['main'];
handler.command = /^(بوت|bot)$/i;

export default handler;
