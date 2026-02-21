const handler = async (m, { conn, args, command, usedPrefix }) => {
const cooldown = 30_000;
const now = Date.now();
const res = await m.db.query('SELECT exp, wait FROM usuarios WHERE id = $1', [m.sender]);
const user = res.rows[0];
const lastWait = Number(user?.wait) || 0;
const remaining = lastWait + cooldown - now;

const colorMap = {
  'احمر': 'red',
  'اسود': 'black',
  'اخضر': 'green',
  'red': 'red',
  'black': 'black',
  'green': 'green'
};

const reverseColorMap = {
  'red': 'احمر',
  'black': 'اسود',
  'green': 'اخضر'
};

if (remaining > 0) return conn.fakeReply(m.chat, `*🕓 اهدأ يا بطل 🤚، انتظر ${msToTime(remaining)} قبل استخدام الأمر مرة أخرى*`, m.sender, `لا ترسل رسائل مزعجة`, 'status@broadcast');
if (args.length < 2) return conn.reply(m.chat, `⚠️ تنسيق غير صحيح. استخدم: ${usedPrefix + command} <اللون> <الكمية>\n\nمثال: ${usedPrefix + command} اسود 100`, m);

const colorInput = args[0].toLowerCase();
const color = colorMap[colorInput];
const betAmount = parseInt(args[1]);

if (!color) return conn.reply(m.chat, '🎯 لون غير صالح. استخدم: "احمر"، "اسود" أو "اخضر".', m);
if (isNaN(betAmount) || betAmount <= 0) return conn.reply(m.chat, '❌ يجب أن يكون المبلغ رقمًا موجبًا.', m);
if (user.exp < betAmount) return conn.reply(m.chat, `❌ ليس لديك ما يكفي من نقاط الخبرة للمراهنة. لديك *${formatExp(user.exp)} XP*`, m);

const resultColor = getRandomColor();
const isWin = resultColor === color;
let winAmount = 0;

if (isWin) {
winAmount = color === 'green' ? betAmount * 14 : betAmount * 2;
}

const newExp = user.exp - betAmount + winAmount;
await m.db.query(`UPDATE usuarios SET exp = $1, wait = $2 WHERE id = $3`, [newExp, now, m.sender]);

const translatedResultColor = reverseColorMap[resultColor];
return conn.reply(m.chat, `😱 استقرت الروليت على *${translatedResultColor}*\n${isWin ? `🎉 لقد ربحت *${formatExp(winAmount)} XP*!` : `💀 لقد خسرت *${formatExp(betAmount)} XP*`}`, m);
};
handler.help = ['روليت <اللون> <الكمية>'];
handler.tags = ['game'];
handler.command = ['rt', 'روليت'];
handler.register = true;

export default handler;

function getRandomColor() {
  const random = Math.random() * 100;
  if (random < 47.5) return 'red';
  if (random < 95) return 'black';
  return 'green';
}

function formatExp(amount) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k (${amount.toLocaleString()})`;
  return amount.toLocaleString();
}

function msToTime(duration) {
  if (isNaN(duration) || duration <= 0) return '0ث';
  const totalSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes > 0 ? minutes + 'د ' : ''}${seconds}ث`;
}
