const cooldown = 30_000;
const retos = new Map();
const jugadas = new Map();
const cooldowns = new Map();
const jugadasValidas = ['حجر', 'ورق', 'مقص'];

let handler = async (m, { conn, args, usedPrefix, command }) => {
const now = Date.now();
const userId = m.sender;
const cooldownRestante = (cooldowns.get(userId) || 0) + cooldown - now;
if (cooldownRestante > 0) return conn.fakeReply(m.chat, `*🕓 مهلاً، انتظر ${msToTime(cooldownRestante)} قبل استخدام الأمر مرة أخرى*`, m.sender, `لا ترسل رسائل مزعجة`, 'status@broadcast');

const res = await m.db.query('SELECT exp FROM usuarios WHERE id = $1', [userId]);
const user = res.rows[0];;
const opponent = m.mentionedJid?.[0];
const input = args[0]?.toLowerCase();

if (!opponent && jugadasValidas.includes(input)) {
cooldowns.set(userId, now);
const botJugada = jugadasValidas[Math.floor(Math.random() * 3)];
const resultado = evaluar(input, botJugada);
const xp = Math.floor(Math.random() * 2000) + 500;

let text = '';
let result = "";
if (resultado === 'gana') {
await m.db.query('UPDATE usuarios SET exp = exp + $1 WHERE id = $2', [xp, userId]);
text += `✅ *لقد فزت* وحصلت على *${formatNumber(xp)} XP*`;
result = 'لقد فزت! 🎉';
} else if (resultado === 'pierde') {
const nuevaXP = Math.max(0, user.exp - xp);
await m.db.query('UPDATE usuarios SET exp = $1 WHERE id = $2', [nuevaXP, userId]);
text += `❌ *لقد خسرت*. تم خصم *${formatNumber(xp)} XP* منك`;
result = 'لقد خسرت! 🤡';
} else {
result = 'تعادل 🤝';
text += `🤝 *تعادل*. لم تفز أو تخسر أي XP.`;
}

return m.reply(`\`「 ${result} 」\`\n\n👉 البوت: ${botJugada}\n👉 أنت: ${input}\n` + text);
}

if (opponent) {
if (retos.has(opponent)) return m.reply('⚠️ هذا المستخدم لديه تحدٍ معلق بالفعل.');
retos.set(opponent, {
retador: userId,
chat: m.chat,
timeout: setTimeout(() => {
retos.delete(opponent);
conn.reply(m.chat, `⏳ انتهى الوقت، تم إلغاء التحدي بسبب عدم استجابة ${opponent.split('@')[0]}`, m, { mentions: [opponent] });
}, 60000)
});

return conn.reply(m.chat, `🎮👾 لاعب ضد لاعب - حجر، ورق، مقص 👾🎮\n\n@${m.sender.split`@`[0]} يتحدى @${opponent.split('@')[0]}.

> _*اكتب (قبول) للقبول*_
> _*اكتب (رفض) للرفض*_`, m, { mentions: [opponent] });
}

m.reply(`حجر 🗿، ورق 📄 أو مقص ✂️\n\n👾 اللعب مع البوت:\n• ${usedPrefix + command} حجر\n• ${usedPrefix + command} ورق\n• ${usedPrefix + command} مقص\n\n🕹 اللعب مع مستخدم:\n${usedPrefix + command} @المستخدم`);
};
handler.before = async (m, { conn }) => {
const text = m.originalText?.toLowerCase();
const userId = m.sender;
if (['قبول', 'رفض'].includes(text) && retos.has(userId)) {
const { retador, chat, timeout } = retos.get(userId);
clearTimeout(timeout);
retos.delete(userId);

if (text === 'رفض') {
return conn.reply(chat, `⚠️ @${userId.split('@')[0]} رفض التحدي.`, m, { mentions: [userId, retador] });
}

jugadas.set(chat, {
jugadores: [retador, userId],
eleccion: {},
timeout: setTimeout(() => {
jugadas.delete(chat);
conn.reply(chat, `⏰ انتهت المباراة بسبب عدم النشاط.`, m);
}, 60000)
});

conn.reply(chat, `✅ تم قبول التحدي. سيتم إرسال الخيارات في رسالة خاصة إلى @${retador.split('@')[0]} و @${userId.split('@')[0]}.`, m, { mentions: [retador, userId] });

await conn.sendMessage(retador, { text: '✊🖐✌️ اكتب *حجر*، *ورق*، أو *مقص* لاختيار حركتك.' });
await conn.sendMessage(userId, { text: '✊🖐✌️ اكتب *حجر*، *ورق*، أو *مقص* لاختيار حركتك.' });
return;
}

if (jugadasValidas.includes(text)) {
for (const [chat, partida] of jugadas) {
const { jugadores, eleccion, timeout } = partida;
if (!jugadores.includes(userId)) continue;

eleccion[userId] = text;
await conn.sendMessage(userId, { text: '✅ تم استلام الاختيار. عد إلى المجموعة وانتظر النتيجة.' });

if (Object.keys(eleccion).length < 2) return;
clearTimeout(timeout);
jugadas.delete(chat);

const [j1, j2] = jugadores;
const jugada1 = eleccion[j1];
const jugada2 = eleccion[j2];
const resultado = evaluar(jugada1, jugada2);
const xp = Math.floor(Math.random() * 2000) + 500;
let mensaje = `✊🖐✌️ *حجر، ورق، مقص*\n\n@${j1.split('@')[0]} اختار: *${jugada1}*\n@${j2.split('@')[0]} اختار: *${jugada2}*\n\n`;

if (resultado === 'empate') {
mensaje += '🤝 تعادل! لا أحد يفوز أو يخسر XP.';
} else {
const ganador = resultado === 'gana' ? j1 : j2;
const perdedor = ganador === j1 ? j2 : j1;
await m.db.query('UPDATE usuarios SET exp = exp + $1 WHERE id = $2', [xp * 2, ganador]);
await m.db.query('UPDATE usuarios SET exp = exp - $1 WHERE id = $2', [xp, perdedor]);
mensaje += `🎉 @${ganador.split('@')[0]} فاز بـ *${formatNumber(xp * 2)} XP*\n💀 @${perdedor.split('@')[0]} خسر *${formatNumber(xp)} XP*`;
}

return conn.sendMessage(chat, { text: mensaje, mentions: [j1, j2] });
}}
};
handler.help = ['حجر_ورق_مقص حجر|ورق|مقص', 'حجر_ورق_مقص @مستخدم'];
handler.tags = ['game'];
handler.command = ['ppt', 'suit', 'pvp', 'suitpvp', 'حجر_ورق_مقص'];
handler.register = true;

export default handler;

function evaluar(a, b) {
  if (a === b) return 'empate';
  if ((a === 'حجر' && b === 'مقص') || (a === 'مقص' && b === 'ورق') || (a === 'ورق' && b === 'حجر')) return 'gana';
  return 'pierde';
}

function formatNumber(n) {
  return n.toLocaleString('en').replace(/,/g, '.');
}

function msToTime(ms) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  return `${m ? `${m}د ` : ''}${s}ث`;
}
