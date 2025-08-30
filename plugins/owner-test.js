import { db } from "../lib/postgres.js";

const handler = async (m, { conn, args }) => {
  const id = conn.user?.id;
  if (!id) return m.reply("❌ تعذر التعرف على هذا البوت.");
  const cleanId = id.replace(/:\d+/, '');

  try {
    const tipoFiltro = args[0] === '1' ? 'oficial' : args[0] === '2' ? 'subbot' : null;
    const [res, conteo] = await Promise.all([
      db.query(`SELECT * FROM subbots${tipoFiltro ? ` WHERE tipo = '${tipoFiltro}'` : ''}`),
      tipoFiltro ? null : db.query(`SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE tipo = 'oficial') AS oficiales,
        COUNT(*) FILTER (WHERE tipo = 'subbot') AS subbots
      FROM subbots`)
    ]);

    if (res.rows.length === 0) {
      return m.reply(tipoFiltro
        ? `❌ لا يوجد بوت من نوع *${tipoFiltro}* في قاعدة البيانات.`
        : "❌ جدول البوتات الفرعية فارغ، لا يوجد شيء لعرضه.");
    }

    let mensaje = `📋 *البوتات ${tipoFiltro ? ` (${tipoFiltro})` : ''}:*\n`;

    if (!tipoFiltro && conteo) {
      const { total, oficiales, subbots } = conteo.rows[0];
      mensaje += `*• البوتات الرسمية:* ${oficiales}\n`;
      mensaje += `*• البوتات الفرعية:* ${subbots}\n\n`;
      mensaje += `\`🤖 الإعدادات:\`\n`;
    }
    
    for (const row of res.rows) {
      mensaje += `- المعرف: ${row.id} (${row.tipo || 'غير معروف'})\n`;
      mensaje += `- الوضع: ${row.mode || 'عام'}\n`;
      mensaje += `- الاسم: ${row.name || 'افتراضي'}\n`;
      mensaje += `- البادئات: ${row.prefix ? row.prefix.join(', ') : '[/,.,#]'}\n`;
      mensaje += `- الملاك: ${row.owners?.length ? row.owners.join(', ') : 'افتراضي'}\n`;
      mensaje += `- مانع الخاص: ${row.anti_private ? 'نعم' : 'لا'}\n`;
      mensaje += `- مانع الاتصال: ${row.anti_call ? 'نعم' : 'لا'}\n`;
      mensaje += `- خصوصية الرقم: ${row.privacy ? 'نعم' : 'لا'}\n`;
      mensaje += `- إعارة البوت: ${row.prestar ? 'نعم' : 'لا'}\n`;
      mensaje += `- الشعار: ${row.logo_url || 'لا يوجد'}\n`;
      mensaje += `\n─────────────\n\n`;
    }

    m.reply(mensaje.trim());

  } catch (err) {
    console.error("❌ خطأ عند الاستعلام عن البوتات الفرعية:", err);
    m.reply("❌ خطأ في قراءة جدول البوتات الفرعية، يرجى إبلاغ المطور بهذا الخطأ.");
  }
};

handler.help = ['testsubbots [opcional: 1|2]'];
handler.tags = ['owner'];
handler.command = /^testsubbots$/i;
handler.register = true;
handler.owner = true;

export default handler;
