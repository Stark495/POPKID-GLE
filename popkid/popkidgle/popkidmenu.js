// === Imports ===
import moment from 'moment-timezone';
import 'fs';
import 'os';
import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = baileys;
import config from '../config.cjs';
import axios from 'axios';

// === Uptime calculation ===
const uptime = process.uptime();
const days = Math.floor(uptime / 86400);
const hours = Math.floor((uptime % 86400) / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
const runMessage = `*${days} Day ${hours} Hour ${minutes} Min ${seconds} Sec*`;

// === Date/time in Africa/Nairobi timezone ===
const currentTime = moment().tz("Africa/Nairobi").format("HH:mm:ss");
const currentDate = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");

// === Greeting based on time of day ===
let greeting = "";
if (currentTime < "05:00:00") {
  greeting = "🌄Good Morning";
} else if (currentTime < "11:00:00") {
  greeting = "🌄Good Morning";
} else if (currentTime < "15:00:00") {
  greeting = "🌅Good Afternoon";
} else if (currentTime < "19:00:00") {
  greeting = "🌃Good Evening";
} else {
  greeting = "🌌Good Night";
}

// === Fancy font converter ===
function toFancyFont(text, upperCase = false) {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ',
    h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ',
    o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ',
    v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
  };
  const formatted = (upperCase ? text.toUpperCase() : text.toLowerCase())
    .split("")
    .map(c => map[c] || c)
    .join("");
  return formatted;
}

// === Fetch menu image with retry ===
async function fetchMenuImage() {
  const url = "https://files.catbox.moe/w2mkty.jpg";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(resp.data, "binary");
    } catch (err) {
      if (err.response?.status === 429 && attempt < 2) {
        console.log("Rate limited—retrying in 2s...");
        await new Promise(r => setTimeout(r, 2000));
      } else {
        console.error("Failed to fetch image:", err);
        return null;
      }
    }
  }
  return null;
}

// === Menu handler function ===
const menu = async (message, client) => {
  try {
    const prefix = config.PREFIX;
    const cmd = message.body.startsWith(prefix)
      ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
      : "";
    const mode = config.MODE === "public" ? "public" : "private";

    const basicMenuCmds = ["list", "popkidmenu", "button"];
    const subMenus = [
      "channel-menu", "converter-menu", "ai-menu", "tools-menu",
      "group-menu", "search-menu", "main-menu", "owner-menu", "stalk-menu"
    ];

    const imageBuffer = await fetchMenuImage();

    // === Main Menu ===
    if (basicMenuCmds.includes(cmd)) {
      const template = `
┌─❖
│ POPKID GLE
└┬❖
┌┤ ${greeting}
│└────────┈⳹
│🕵️ Username: *${message.pushName}*
│📅 Date: *${currentDate}*
│⏰ Time: *${currentTime}*
│⭐ Uptime: ${runMessage}
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

_click any button above to access that section_

> ✆︎Powered by popkid
      `.trim();

      const buttons = [
        { buttonId: prefix + "menu", buttonText: { displayText: "Menu |commanders" }, type: 1 },
        { buttonId: prefix + "popkid hello can l ask please", buttonText: { displayText: "NjabuloJb |AI model" }, type: 1 },
        { buttonId: prefix + "channel-menu", buttonText: { displayText: "Follow family |INFORMATION|" }, type: 1 }
      ];

      const context = {
        mentionedJid: [message.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420342566562@newsletter",
          newsletterName: "╭••➤®popkid",
          serverMessageId: 0x8f
        }
      };

      const msgOptions = {
        viewOnce: true,
        buttons,
        contextInfo: context
      };

      if (imageBuffer) {
        await client.sendMessage(message.from, {
          image: imageBuffer,
          caption: template,
          ...msgOptions
        }, {
          quoted: {
            key: {
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast"
            },
            message: {
              contactMessage: {
                displayName: "✆︎popkid verified",
                vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=254700000000:+254 700 000000\nitem1.X-ABLabel:Bot\nEND:VCARD"
              }
            }
          }
        });
      } else {
        await client.sendMessage(message.from, {
          text: template,
          ...msgOptions
        }, { quoted: message });
      }

      // Send voice note after the menu
      await client.sendMessage(message.from, {
        audio: { url: "https://files.catbox.moe/mflouf.mp3" },
        mimetype: "audio/mp4",
        ptt: true
      }, {
        quoted: {
          key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast"
          },
          message: {
            contactMessage: {
              displayName: "✆︎popkid verified",
              vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=254700000000:+254 700 000000\nitem1.X-ABLabel:Bot\nEND:VCARD"
            }
          }
        }
      });
    }

    // === Sub-menus like channel-menu ===
    if (subMenus.includes(cmd)) {
      if (cmd === "channel-menu") {
        const text = `
📅 Date: ${currentDate}
⏰ Time: ${currentTime}
⚙️ Prefix: ${prefix}
🌐 Mode: ${mode}

*Follow Join family update*
        `.trim();

        await client.sendMessage(message.from, {
          text,
          contextInfo: {
            mentionedJid: [message.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363420342566562@newsletter",
              newsletterName: "╭••➤®popkid",
              serverMessageId: 0x8f
            }
          }
        }, {
          quoted: {
            key: {
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast"
            },
            message: {
              contactMessage: {
                displayName: "✆︎popkid verified",
                vcard: "BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=254700000000:+254 700 000000\nitem1.X-ABLabel:Bot\nEND:VCARD"
              }
            }
          }
        });
      }
    }

  } catch (err) {
    console.error("❌ Menu error:", err);
    await client.sendMessage(message.from, {
      text: `•\n• *popkid gle* encountered an error! Error: ${err.message || "Unknown"} 😡\n•`
    }, {
      quoted: message
    });
  }
};

export default menu;
