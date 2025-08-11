// 🌟✨=== PopKid Stylish Menu Command ===✨🌟
import config from '../../config.cjs';
import fetch from 'node-fetch';
import fs from 'fs';
import moment from 'moment-timezone';

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const body = m.body || '';
  const cmd = body.startsWith(prefix)
    ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
    : body.trim();
  const isNumberReply = /^[1-9]$/.test(cmd);

  // 📰 Newsletter Context — for rich message forwarding
  const newsletterContext = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterName: "✨ Popkid-Gle ✨",
      newsletterJid: "120363420342566562@newsletter"
    }
  };

  // 📜 Category Menus — with unique box styles for each
  const categoryMenus = {
    "1": `
━━━━━━━━━━━━━━━❁
│  1️⃣ MAIN & BOT COMMANDS
│  ────────────────
│  ✨ ${prefix}menu
│  ✨ ${prefix}alive
│  ✨ ${prefix}ping
│  ✨ ${prefix}speed
│  ✨ ${prefix}sudo
│  ✨ ${prefix}dev
│  ✨ ${prefix}addpremium
╰━━━━━━━━━━━━━━━❁`,
    "2": `
╭─────────────────────────╮
│  2️⃣ OWNER COMMANDS
├─────────────────────────┤
│  👑 ${prefix}restart
│  👑 ${prefix}join
│  👑 ${prefix}autoread
│  👑 ${prefix}block
│  👑 ${prefix}unblock
│  👑 ${prefix}setprefix
│  👑 ${prefix}repo
╰─────────────────────────╯`,
    "3": `
╔═════════════════════════╗
║  3️⃣ AI & CHAT
╠═════════════════════════╣
║  🤖 ${prefix}ai
║  🤖 ${prefix}gpt
║  🤖 ${prefix}chatbot
║  🤖 ${prefix}gemini
║  🤖 ${prefix}lydia
║  🤖 ${prefix}popkid-ai
╚═════════════════════════╝`,
    "4": `
╭━┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮
┃  4️⃣ SEARCH & TOOLS
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃  🔍 ${prefix}google
┃  🔍 ${prefix}ytsearch
┃  🔍 ${prefix}facebook
┃  🔍 ${prefix}instagram
┃  🔍 ${prefix}lyrics
┃  🔍 ${prefix}mediafire
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
    "5": `
╔─┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈─╗
│  5️⃣ CONVERTERS & UTILITIES
├─────────────────────┤
│  🔄 ${prefix}sticker
│  🔄 ${prefix}mp3
│  🔄 ${prefix}attp
│  🔄 ${prefix}url
│  🔄 ${prefix}shorten
│  🔄 ${prefix}ss
│  🔄 ${prefix}sessioncheck
╰─────────────────────╯`,
    "6": `
╭════════════════════╮
│  6️⃣ GROUP CONTROL
├────────────────────┤
│  👥 ${prefix}tagall
│  👥 ${prefix}hidetag
│  👥 ${prefix}kick
│  👥 ${prefix}add
│  👥 ${prefix}group open
│  👥 ${prefix}group close
│  👥 ${prefix}antilink
│  👥 ${prefix}antidelete
╰────────────────────╯`,
    "7": `
┏━━━━━━━━━━━━━━━━━━━━┓
┃  7️⃣ FUN, GAMES & REACTIONS
┣━━━━━━━━━━━━━━━━━━━━┫
┃  🎉 ${prefix}flirt
┃  🎉 ${prefix}quizz
┃  🎉 ${prefix}anime
┃  🎉 ${prefix}ttt
┃  🎉 ${prefix}yesorno
┃  🎉 ${prefix}movie
┃  🎉 ${prefix}bonk
┃  🎉 ${prefix}smile
┃  🎉 ${prefix}hug
┃  🎉 ${prefix}kiss
┗━━━━━━━━━━━━━━━━━━━━┛`,
    "8": `
╔══════════════════════╗
║  8️⃣ AUDIO FX & MUSIC
╠══════════════════════╣
║  🎵 ${prefix}bass
║  🎵 ${prefix}earrape
║  🎵 ${prefix}deep
║  🎵 ${prefix}robot
║  🎵 ${prefix}reverse
║  🎵 ${prefix}nightcore
╚══════════════════════╝`,
    "9": `
╭─────────────────────╮
│  9️⃣ HENTAI (18+)
├─────────────────────┤
│  🔞 ${prefix}hneko
│  🔞 ${prefix}hwaifu
│  🔞 ${prefix}hentai
│  🔞 ${prefix}trap
╰─────────────────────╯`
  };

  // 📌 Number reply handler — OLD method still valid
  if (
    isNumberReply &&
    m.quoted?.key.fromMe &&
    m.quoted?.message?.imageMessage?.caption?.includes("SELECT A CATEGORY BELOW")
  ) {
    return await sock.sendMessage(
      m.from,
      {
        text: categoryMenus[cmd] || "❌ Invalid number. Please select a valid category.",
        contextInfo: newsletterContext,
      },
      { quoted: m }
    );
  }

  // 📌 Main menu with profile pic, uptime & speed
  if (cmd === "menu2") {
    const start = Date.now();
    await m.React('⚡');
    const responseTime = ((Date.now() - start) / 1000).toFixed(2);

    // Uptime calculation
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const uptime = `${hours}h ${minutes}m ${seconds}s`;

    // Fetch profile picture or fallback
    let profilePictureUrl = 'https://files.catbox.moe/x18hgf.jpg';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const pp = await sock.profilePictureUrl(m.sender, 'image', { signal: controller.signal });
      clearTimeout(timeout);
      if (pp) profilePictureUrl = pp;
    } catch {
      console.log("❌ Profile picture fetch failed.");
    }

    // Stylish main menu header with unique box style
    const mainMenu = `
━━━━━━━━━━━━━━━❁
│ ✨ 𝗣𝗼𝗽𝗞𝗶𝗱 𝗚𝗟𝗘 𝗠𝗲𝗻𝘂 ✨
│ ⚡ 𝗦𝗽𝗲𝗲𝗱: *${responseTime}s*
│ ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: *${uptime}*
│ 🌍 𝗠𝗼𝗱𝗲: *Public*
│ 🔐 𝗣𝗿𝗲𝗳𝗶𝘅: *${prefix}*
╰━━━━━━━━━━━━━━━❁

💬 𝗦𝗲𝗹𝗲𝗰𝘁 𝗮 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝘆 𝗯𝗲𝗹𝗼𝘄:
`;

    // Send main menu with buttons
    await sock.sendMessage(
      m.from,
      {
        image: { url: profilePictureUrl },
        caption: mainMenu,
        footer: "💎 PopKid Engine — Premium Experience 💎",
        buttons: [
          { buttonId: `${prefix}cat1`, buttonText: { displayText: '1️⃣ MAIN & BOT COMMANDS' }, type: 1 },
          { buttonId: `${prefix}cat2`, buttonText: { displayText: '2️⃣ OWNER COMMANDS' }, type: 1 },
          { buttonId: `${prefix}cat3`, buttonText: { displayText: '3️⃣ AI & CHAT' }, type: 1 },
          { buttonId: `${prefix}cat4`, buttonText: { displayText: '4️⃣ SEARCH & TOOLS' }, type: 1 },
          { buttonId: `${prefix}cat5`, buttonText: { displayText: '5️⃣ CONVERTERS & UTILITIES' }, type: 1 },
          { buttonId: `${prefix}cat6`, buttonText: { displayText: '6️⃣ GROUP CONTROL' }, type: 1 },
          { buttonId: `${prefix}cat7`, buttonText: { displayText: '7️⃣ FUN, GAMES & REACTIONS' }, type: 1 },
          { buttonId: `${prefix}cat8`, buttonText: { displayText: '8️⃣ AUDIO FX & MUSIC' }, type: 1 },
          { buttonId: `${prefix}cat9`, buttonText: { displayText: '9️⃣ HENTAI (18+)' }, type: 1 }
        ],
        headerType: 4,
        contextInfo: newsletterContext
      },
      { quoted: m }
    );

    // 🎶 Play random hype audio
    const songUrls = [
      'https://files.catbox.moe/2b33jv.mp3',
      'https://files.catbox.moe/0cbqfa.mp3',
      'https://files.catbox.moe/j4ids2.mp3',
      'https://files.catbox.moe/vv2qla.mp3'
    ];
    const randomSong = songUrls[Math.floor(Math.random() * songUrls.length)];

    await sock.sendMessage(
      m.from,
      { audio: { url: randomSong }, mimetype: 'audio/mpeg', ptt: false, contextInfo: newsletterContext },
      { quoted: m }
    );
  }

  // 📌 Handle category button presses (cat1 - cat9)
  if (/^cat[1-9]$/.test(cmd)) {
    const num = cmd.replace('cat', '');
    if (categoryMenus[num]) {
      return await sock.sendMessage(
        m.from,
        { text: categoryMenus[num], contextInfo: newsletterContext },
        { quoted: m }
      );
    }
  }
};

export default menu;
