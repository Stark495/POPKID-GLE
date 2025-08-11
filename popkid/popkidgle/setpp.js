import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
import config from '../config.cjs';

const setProfilePicture = async (m, sock) => {
  const botNumber = await sock.decodeJid(sock.user.id);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd !== "setpp") return;

  // Optional: Restrict to bot only
  if (m.sender !== botNumber) {
    return sock.sendMessage(m.from, { text: "❌ This command can only be used by the bot itself." }, { quoted: m });
  }

  // Check replied image
  if (!m.quoted?.message?.imageMessage) {
    return sock.sendMessage(m.from, { text: "⚠️ Please *reply to an image* to set as profile picture." }, { quoted: m });
  }

  // React loading
  await sock.sendMessage(m.from, { react: { text: '⏳', key: m.key } });

  try {
    // Download image
    const media = await downloadMediaMessage(m.quoted, 'buffer');
    if (!media) throw new Error("Image download failed");

    // Read image
    let image = await Jimp.read(media);

    // Make square
    if (image.bitmap.width !== image.bitmap.height) {
      const size = Math.max(image.bitmap.width, image.bitmap.height);
      const squareImage = new Jimp(size, size, 0x000000FF);
      squareImage.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);
      image = squareImage;
    }

    // Resize
    image.resize(640, 640);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // Set profile picture
    await sock.updateProfilePicture(botNumber, buffer);

    // Success
    await sock.sendMessage(m.from, { react: { text: '✅', key: m.key } });
    return sock.sendMessage(m.from, {
      text: "✅ *Profile Picture Updated successfully!*",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: "popkid",
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error("Error setting profile picture:", err);
    await sock.sendMessage(m.from, { react: { text: '❌', key: m.key } });
    return sock.sendMessage(m.from, { text: "❌ An error occurred while updating the profile picture." }, { quoted: m });
  }
};

export default setProfilePicture;
