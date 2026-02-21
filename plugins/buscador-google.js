//import {googleIt} from '@bochilteam/scraper';
import axios from 'axios';
import fetch from 'node-fetch';
let handler = async (m, { conn, text, command, args, usedPrefix }) => {
if (!text) return m.reply(`⚠️ 𝙌𝙪𝙚 𝙚𝙨𝙩𝙖 𝙗𝙪𝙨𝙘𝙖𝙣𝙙𝙤 🤔 𝙀𝙨𝙘𝙧𝙞𝙗𝙖 𝙡𝙤 𝙦𝙪𝙚 𝙦𝙪𝙞𝙚𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧\n• 𝙀𝙟: ${usedPrefix + command} loli`)
m.react("⌛") 
try {
const res = await fetch(`${info.apis}/search/googlesearch?query=${text}`);
const data = await res.json();
    
if (data.status && data.data && data.data.length > 0) {
let teks = `\`🔍 𝘙𝘌𝘚𝘜𝘓𝘛𝘈𝘋𝘖𝘚 𝘋𝘌:\` ${text}\n\n`;
for (let result of data.data) {
teks += `*${result.title}*\n_${result.url}_\n_${result.description}_\n\n─────────────────\n\n`;
}
                
const ss = `https://image.thum.io/get/fullpage/https://google.com/search?q=${encodeURIComponent(text)}`;
conn.sendFile(m.chat, ss, 'result.png', teks, m);
m.react("✅")                 
}} catch {
try {
const res = await fetch(`https://api.alyachan.dev/api/google?q=${text}&apikey=Gata-Dios`);
const data = await res.json();

if (data.status && data.data && data.data.length > 0) {
let teks = `🔍 *Resultados de:* ${text}\n\n`;
for (let result of data.data) {
teks += `📌 *${result.title}*\n🔗 _${result.formattedUrl || result.url}_\n📖 _${result.snippet || result.description}_\n\n─────────────────\n\n`;
}
const ss = `https://image.thum.io/get/fullpage/https://google.com/search?q=${encodeURIComponent(text)}`;
conn.sendFile(m.chat, ss, 'result.png', teks, m);
}} catch (e) {
handler.limit = 0;
console.log(e);
m.react("❌")  
}}}
handler.help = ['google', 'googlef'].map(v => v + ' <pencarian>')
handler.tags = ['buscadores']
handler.command = /^(googlef?|جوجل)$/i
handler.register = true
handler.limit = 1;     
export default handler
