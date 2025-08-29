import ws from 'ws'
import { getSubbotConfig } from '../lib/postgres.js'

const handler = async (m, { conn }) => {
// استخلاص المعرف الرئيسي للبوت
const mainId = globalThis.conn?.user?.id?.split('@')[0].split(':')[0]

// فلترة الاتصالات للعثور على البوتات الفرعية النشطة
const activos = (globalThis.conns || []).filter(sock => {
const id = sock?.userId || sock?.user?.id?.split('@')[0];
const isAlive = sock?.userId && typeof sock?.uptime === 'number';
return isAlive && id !== mainId;
});

// إذا لم يتم العثور على أي بوتات فرعية، يتم إرسال رسالة وإيقاف التنفيذ
if (!activos.length) return m.reply("❌ لا توجد بوتات فرعية متصلة حاليًا.")

// بناء رسالة القائمة
let mensaje = `🤖 *البوتات الفرعية النشطة: ${activos.length}*\n\n`
const participantes = m.isGroup ? (await conn.groupMetadata(m.chat).catch(() => ({ participants: [] }))).participants || [] : []

for (const sock of activos) {
const userId = sock.user?.id
if (!userId) continue
const cleanId = userId.replace(/:\d+/, '').split('@')[0]
const configId = userId.replace(/:\d+/, '')
const nombre = sock.user.name || "-"
let config = {}
try {
// محاولة جلب إعدادات البوت الفرعي
config = await getSubbotConfig(configId)
} catch {
// استخدام إعدادات افتراضية في حالة الفشل
config = { prefix: ["/", ".", "#"], mode: "public" }
}

const modo = config.mode === "private" ? "خاص" : "عام"
const prefijos = Array.isArray(config.prefix) ? config.prefix : [config.prefix]
const prefText = prefijos.map(p => `\`${p}\``).join(", ")
const mainPrefix = (prefijos[0] === "") ? "" : prefijos[0]
const textoMenu = mainPrefix ? `${mainPrefix}menu` : "menu"
const uptime = sock.uptime ? formatearMs(Date.now() - sock.uptime) : "غير معروف"
const estaEnGrupo = participantes.some(p => p.id === userId)
const mostrarNumero = !config.privacy
const mostrarPrestar = config.prestar && !config.privacy

// إضافة معلومات كل بوت إلى الرسالة
let lineaBot = `• ${mostrarNumero ? `wa.me/${cleanId}?text=${encodeURIComponent(textoMenu)} (${nombre})` : `(${nombre})`}\n`
mensaje += lineaBot
mensaje += `   ⏱️ مدة التشغيل: *${uptime}*\n`
mensaje += `   ⚙️ الوضع: *${modo}*\n`
mensaje += `   🛠️ البادئة: ${prefText}\n`
if (mostrarPrestar) mensaje += `   🟢 *إعارة بوت*: #انضم <رابط>\n`
mensaje += `\n`
}
// إرسال الرسالة النهائية
return m.reply(mensaje.trim())
}

// إعدادات تعريف الأمر
handler.help = ['البوتات']
handler.tags = ['jadibot']
handler.command = /^(bots|البوتات)$/i // الأمر يعمل باللغتين
export default handler

// دالة لتحويل المللي ثانية إلى تنسيق مقروء (يوم، ساعة، دقيقة، ثانية)
function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)
  return `${dias}ي ${horas % 24}س ${minutos % 60}د ${segundos % 60}ث`
}
