import moment from 'moment-timezone';
import axios from 'axios';
import config from '../config.cjs';

// === Fetch menu image ===
async function fetchMenuImage() {
  const url = "https://files.catbox.moe/w2mkty.jpg";
  try {
    const resp = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(resp.data, "binary");
  } catch {
    return null;
  }
}

const menu = async (m, sock) => {
  try {
    // ✅ Get message text safely
    const msgText =
      m.body ||
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      "";

    const prefix = config.PREFIX;
    const cmd = msgText.startsWith(prefix)
      ? msgText.slice(prefix.length).split(" ")[0].toLowerCase()
      : "";

    // ✅ Only respond to "popkidmenu"
    if (cmd !== "popkidmenu") return;

    // React loading
    await sock.sendMessage(m.from, { react: { text: '⏳', key: m.key } });

    // === Uptime ===
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // === Date & Time ===
    const now = moment().tz("Africa/Nairobi");
    const currentDate = now.format("DD/MM/YYYY");
    const currentTime = now.format("HH:mm:ss");
    const hour = parseInt(now.format("HH"), 10);

    let greeting = "🌌 Good Night";
    if (hour < 5) greeting = "🌄 Good Morning";
    else if (hour < 11) greeting = "🌄 Good Morning";
    else if (hour < 15) greeting = "🌅 Good Afternoon";
    else if (hour < 19) greeting = "🌃 Good Evening";

    // === Menu Text ===
    const template = `
┌─❖
│ POPKID GLE
└┬❖
┌┤ ${greeting}
│└────────┈⳹
│🕵️ Username: *${m.pushName}*
│📅 Date: *${currentDate}*
│⏰ Time: *${currentTime}*
│⭐ Uptime: *${days} Day ${hours} Hour ${minutes} Min ${seconds} Sec*
└─────────────┈⳹

*📋 MENU OPTIONS*
1. 🎵DOWNLOAD MENU
2. 👨‍👨‍👦‍👦GROUP MENU
3. 😂FUN MENU
4. OWNER MENU
5. 🤖AI MENU
6. 🙀ANIME MENU
7. 💬CONVERTER MENU
8. ♻️OTHER MENU
9. 📜REACTIONS MENU
10. 📥MAIN MENU

> ✆︎Powered by popkid
`.trim();

    // === Template Buttons (latest Baileys format) ===
    const templateButtons = [
      { index: 1, quickReplyButton: { displayText: "📜 Main Menu", id: `${prefix}main-menu` } },
      { index: 2, quickReplyButton: { displayText: "👨‍👨‍👦 Group Menu", id: `${prefix}group-menu` } },
      { index: 3, quickReplyButton: { displayText: "🤖 AI Menu", id: `${prefix}ai-menu` } }
    ];

    const imageBuffer = await fetchMenuImage();

    if (imageBuffer) {
      await sock.sendMessage(m.from, {
        image: imageBuffer,
        caption: template,
        footer: "╭••➤®popkid",
        templateButtons
      }, { quoted: m });
    } else {
      await sock.sendMessage(m.from, {
        text: template,
        footer: "╭••➤®popkid",
        templateButtons
      }, { quoted: m });
    }

    // React success
    await sock.sendMessage(m.from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error("Menu error:", err);
    await sock.sendMessage(m.from, { text: `❌ Error showing menu: ${err.message}` }, { quoted: m });
    await sock.sendMessage(m.from, { react: { text: '❌', key: m.key } });
  }
};

export default menu;
