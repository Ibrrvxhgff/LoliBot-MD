import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { savetube } from '../lib/yt-savetube.js';
import { ogmp3 } from '../lib/youtubedl.js';
import { amdl, ytdown } from '../lib/scraper.js';

const userRequests = {};
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply('*ما الذي تبحث عنه🤔 أدخل رابط يوتيوب لتنزيل الملف الصوتي أو الفيديو*');
    const sendType = command.includes('doc') ? 'document' : (command.includes('mp3') || command === 'يوتيوب_صوت') ? 'audio' : 'video';
    const yt_play = await search(args.join(' '));
    let youtubeLink = '';
    if (args[0].includes('you')) {
        youtubeLink = args[0];
    } else {
        const index = parseInt(args[0]) - 1;
        if (index >= 0) {
            if (Array.isArray(global.videoList) && global.videoList.length > 0) {
                const matchingItem = global.videoList.find(item => item.from === m.sender);
                if (matchingItem) {
                    if (index < matchingItem.urls.length) {
                        youtubeLink = matchingItem.urls[index];
                    } else {
                        return m.reply(`⚠️ لم يتم العثور على رابط لهذا الرقم، يرجى إدخال رقم بين 1 و ${matchingItem.urls.length}*`);
                    }
                }
            }
        }
    }

    if (userRequests[m.sender]) {
        return m.reply('⏳ *انتظر...* هناك طلب قيد التنفيذ بالفعل. من فضلك انتظر حتى ينتهي قبل تقديم طلب آخر.');
    }
    userRequests[m.sender] = true;

    try {
        if (command === 'ytmp3' || command === 'fgmp3' || command === 'ytmp3doc' || command === 'يوتيوب_صوت') {
            m.reply([`*⌛ انتظر ✋ لحظة... جارٍ تنزيل الصوت الخاص بك🍹*`, `⌛ جارٍ المعالجة...\n*أحاول تنزيل الصوت الخاص بك، انتظر 🏃‍♂️💨*`, `اهدأ، أنا أبحث عن أغنيتك 😎\n\n*تذكر أن تكتب اسم الأغنية أو رابط فيديو يوتيوب بشكل صحيح*\n\n> *إذا لم يعمل الأمر *play، استخدم الأمر *ytmp3*`].getRandom());
            try {
                const result = await savetube.download(args[0], 'mp3');
                const data = result.result;
                await conn.sendMessage(m.chat, { [sendType]: { url: data.download }, mimetype: 'audio/mpeg', fileName: `audio.mp3`, contextInfo: {} }, { quoted: m });
            } catch {
                try {
                    const response = await amdl.download(args[0], 'mp3');
                    const { title, type, download } = response.result;
                    if (type === 'audio') {
                        await conn.sendMessage(m.chat, { [sendType]: { url: download }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
                    }
                } catch {
                    try {
                        const response = await ytdown.download(args[0], 'mp3');
                        const { title, type, download } = response;
                        if (type === 'audio') {
                            await conn.sendMessage(m.chat, { [sendType]: { url: download }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
                        }
                    } catch {
                       m.reply('❌ تعذر تنزيل الصوت. جارٍ تجربة واجهات برمجة تطبيقات أخرى...');
                    }
                }
            }
        }

        if (command === 'ytmp4' || command === 'fgmp4' || command === 'ytmp4doc' || command === 'يوتيوب_فيديو') {
            m.reply([`*⌛ انتظر ✋ لحظة... جارٍ تنزيل الفيديو الخاص بك🍹*`, `⌛ جارٍ المعالجة...\n*أحاول تنزيل الفيديو الخاص بك، انتظر 🏃‍♂️💨*`, `اهدأ ✋🥸🤚\n\n*جارٍ تنزيل الفيديو الخاص بك 🔄*\n\n> *انتظر لحظة، من فضلك*`].getRandom());
            try {
                const result = await savetube.download(args[0], '720');
                const data = result.result;
                await conn.sendMessage(m.chat, { [sendType]: { url: data.download }, mimetype: 'video/mp4', fileName: `${data.title}.mp4`, caption: `🔰 ها هو الفيديو الخاص بك\n🔥 العنوان: ${data.title}` }, { quoted: m });
            } catch {
                try {
                    const [input, quality = '720'] = text.split(' ');
                    const res = await ogmp3.download(yt_play[0].url, quality, 'video');
                    await conn.sendMessage(m.chat, { [sendType]: { url: res.result.download }, mimetype: 'video/mp4', caption: `🔰 ها هو الفيديو الخاص بك \n🔥 العنوان: ${yt_play[0].title} (${quality}p)` }, { quoted: m });
                } catch {
                    try {
                        const response = await amdl.download(args[0], '720p');
                        const { title, type, download, thumbnail } = response.result;
                        if (type === 'video') {
                            await conn.sendMessage(m.chat, { [sendType]: { url: download }, caption: `🔰 ها هو الفيديو الخاص بك \n🔥 العنوان: ${title}`, thumbnail: thumbnail }, { quoted: m });
                        }
                    } catch {
                        try {
                            const response = await ytdown.download(args[0], 'mp4');
                            const { title, type, download, thumbnail } = response;
                            if (type === 'video') {
                                await conn.sendMessage(m.chat, { [sendType]: { url: download }, caption: `🔰 ها هو الفيديو الخاص بك \n🔥 العنوان: ${title}`, thumbnail: thumbnail }, { quoted: m });
                            }
                        } catch {
                           m.reply('❌ تعذر تنزيل الفيديو. جارٍ تجربة واجهات برمجة تطبيقات أخرى...');
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        m.react("❌️");
    } finally {
        delete userRequests[m.sender];
    }
};
handler.help = ['ytmp4', 'ytmp3'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3|ytmp4|fgmp4|fgmp3|dlmp3|ytmp4doc|ytmp3doc|يوتيوب_صوت|يوتيوب_فيديو)$/i;
export default handler;

async function search(query, options = {}) {
    const search = await yts.search({ query, hl: 'ar', gl: 'AR', ...options });
    return search.videos;
}

// Other utility functions remain the same...