import * as Jimp from 'jimp';

let handler = async (m, { conn }) => {
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply('يرجى الرد على صورة لتغيير صورة المجموعة.');
    }

    try {
        const media = await quoted.download();
        const image = await Jimp.read(media);
        
        // Resize the image to a square of 720x720, common for profile pictures
        const processedImage = await image.cover(720, 720).getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(m.chat, processedImage);
        m.reply('✅ تم تحديث صورة المجموعة بنجاح.');

    } catch (error) {
        console.error(error);
        m.reply('❌ حدث خطأ أثناء تحديث الصورة. تأكد من الرد على صورة صالحة وأن البوت لديه صلاحيات المشرف.');
    }
};

handler.help = ['تغيير_الصورة (بالرد على صورة)'];
handler.tags = ['group'];
handler.command = /^(setpp(group|grup|gc)?|تغيير_الصورة|صورة_المجموعة)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
