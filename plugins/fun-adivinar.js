import fs from 'fs';
import fetch from 'node-fetch';
import similarity from 'similarity';

const timeout = 50000;
const timeout2 = 20000;
const poin = 500;
const threshold = 0.72;
const juegos = {};
const preguntasUsadas = new Set();

const archivosRespaldo = {
  acertijo: "acertijo.json",
  pelicula: "peliculas.json",
  trivia: "trivia.json"
};

async function obtenerPregunta(tipo) {
  const prompt = {
    acertijo: "أنشئ لغزًا مع إجابته بتنسيق JSON: {\"question\": \"<سؤال>\", \"response\": \"<إجابة>\"}.",
    pelicula: "أنشئ لعبة تخمين الفيلم باستخدام الرموز التعبيرية كدليل، بتنسيق JSON: {\"question\": \"<سؤال>\", \"response\": \"<إجابة>\"}.",
    trivia: "أنشئ سؤال تريفيا بتنسيق JSON: {\"question\": \"<سؤال>\\n\\nA) ...\\nB) ...\\nC) ...\", \"response\": \"<الحرف الصحيح>\"}."
  }[tipo];

  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(`https://api.neoxr.eu/api/gptweb?text=${encodeURIComponent(prompt)}&apikey=russellxz`);
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) throw new Error(`Invalid API response (${res.status})`);
      const json = await res.json();
      if (json?.data) {
        const match = json.data.match(/```json\s*([\s\S]*?)\s*```/);
        const clean = match ? match[1] : json.data;
        const obj = JSON.parse(clean);
        if (obj.question && obj.response && !preguntasUsadas.has(obj.question)) {
          preguntasUsadas.add(obj.question);
          return obj;
        }
      }
    } catch (e) {
      console.error('[IA backup]', e.message || e);
    }
  }

  try {
    const archivo = `./src/game/${archivosRespaldo[tipo]}`;
    const data = JSON.parse(fs.readFileSync(archivo));
    const pregunta = data[Math.floor(Math.random() * data.length)];
    preguntasUsadas.add(pregunta.question);
    return pregunta;
  } catch (e) {
    console.error('Respaldo fallido', e);
    return null;
  }
}

let handler = async (m, { conn, command }) => {
const id = m.chat;
if (juegos[id]) return conn.reply(m.chat, '⚠️ هناك لعبة نشطة بالفعل في هذه الدردشة.', m);

const tipo = /acert|لغز/i.test(command) ? 'acertijo' : /pelicula|adv|فيلم/i.test(command) ? 'pelicula' : /trivia|تريفيا/i.test(command) ? 'trivia' : null;
if (!tipo) return;
const pregunta = await obtenerPregunta(tipo);
if (!pregunta) return m.reply('❌ تعذر إنشاء السؤال.');
const tiempo = tipo === 'trivia' ? timeout2 : timeout;
const texto = `${pregunta.question}

*• الوقت:* ${tiempo / 1000} ثانية
*• المكافأة:* +${poin} XP`;
const enviado = await conn.sendMessage(m.chat, { text: texto }, { quoted: m });

juegos[id] = {
tipo,
pregunta,
caption: enviado,
puntos: poin,
intentos: 3,
timeout: setTimeout(() => {
if (juegos[id]) {
conn.reply(m.chat, `⏳ انتهى الوقت.\n*الإجابة:* ${pregunta.response}`, enviado);
delete juegos[id];
}}, tiempo)
}};

handler.before = async (m, { conn }) => {
const id = m.chat;
if (!juegos[id] || !m.quoted?.key?.id || !juegos[id].caption?.key?.id || m.quoted.key.id !== juegos[id].caption.key.id) return;

const juego = juegos[id];
const correcta = juego.pregunta.response.toLowerCase().trim();
const userInput = m.originalText.toLowerCase().trim();
const esCorrecta = userInput === correcta || similarity(userInput, correcta) >= threshold;

if (esCorrecta) {
await m.db.query('UPDATE usuarios SET exp = exp + $1 WHERE id = $2', [juego.puntos, m.sender]);
m.reply(`✅ *صحيح!*\nلقد ربحت +${juego.puntos} XP`);
clearTimeout(juego.timeout);
delete juegos[id];
} else {
juego.intentos--;
if (juego.intentos <= 0) {
m.reply(`❌ لقد فشلت 3 مرات. كانت الإجابة: *${juego.pregunta.response}*`);
clearTimeout(juego.timeout);
delete juegos[id];
} else {
m.reply(`❌ غير صحيح. يتبقى لديك *${juego.intentos}* محاولة.`);
}}
};
handler.help = ['لغز', 'فيلم', 'تريفيا'];
handler.tags = ['game'];
handler.command = /^(acertijo|acert|adivinanza|tekateki|لغز|pelicula|adv|فيلم|trivia|تريفيا)$/i;
handler.register = true;

export default handler;
