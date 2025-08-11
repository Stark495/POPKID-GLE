const ping2 = async (m, bot) => {
  const validCommands = ['url', 'geturl', 'upload', 'u'];
  const prefixMatch = m.body?.trim().match(/^([\\/!#.\-])(\w+)/);
  const prefix = prefixMatch ? prefixMatch[1] : '!'; // fallback prefix

  // If the 📡 Ping button is pressed
  if (m.message?.buttonsResponseMessage) {
    const buttonId = m.message.buttonsResponseMessage.selectedButtonId;
    if (buttonId === "ping_now") {
      // Simulate the user sending a ping command
      m.body = `${prefix}ping`;
      return bot.ev.emit("messages.upsert", {
        messages: [m],
        type: "notify"
      });
    }
  }

  if (!prefixMatch) return;
  const cmd = prefixMatch[2].toLowerCase();
  if (!validCommands.includes(cmd)) return;

  if (
    !m.quoted ||
    !['imageMessage', 'videoMessage', 'audioMessage'].includes(m.quoted.mtype)
  ) {
    return m.reply(
      `💀 *Invalid Input!*\nReply to an image, video, or audio.\n\n📥 Usage:\n\`${prefix}${cmd}\``
    );
  }

  try {
    const media = await m.quoted.download();
    if (!media) throw new Error('Media download failed.');

    const fileSizeMB = media.length / (1024 * 1024);
    if (fileSizeMB > 200) {
      return m.reply(`⛔ *Upload Blocked!*\nFile size > 200MB`);
    }

    const mediaUrl = await uploadMedia(media);
    const mediaType = getMediaType(m.quoted.mtype);
    const mediaTypeName =
      mediaType.charAt(0).toUpperCase() + mediaType.slice(1);

    const contextInfo = {
      forwardingScore: 100,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "Popkid-Gle-HAX",
        newsletterJid: "120363420342566562@newsletter",
      },
    };

    const caption = `
🟩──[ 💀 POPKID HACKTOOL ]──🟩
📁 TYPE   : ${mediaTypeName}
🌍 LINK   : ${mediaUrl}
👤 USER   : ${m.pushName || "Anonymous"}
⏱️ TIME   : ${new Date().toLocaleString('en-GB')}
✅ STATUS : SUCCESS
🟩──────────────🟩
🔗 Popkid XMD Hacker Network
`.trim();

    // Send uploaded media info
    if (mediaType === 'audio') {
      await bot.sendMessage(
        m.from,
        { text: caption, contextInfo },
        { quoted: m }
      );
    } else {
      await bot.sendMessage(
        m.from,
        {
          [mediaType]: { url: mediaUrl },
          caption,
          contextInfo,
        },
        { quoted: m }
      );
    }

    // Send Ping Button
    await bot.sendMessage(
      m.from,
      {
        text: "✅ File uploaded successfully!\nTap below to check bot ping instantly.",
        footer: "Popkid Network",
        buttons: [
          { buttonId: "ping_now", buttonText: { displayText: "📡 Ping" }, type: 1 }
        ],
        headerType: 1
      },
      { quoted: m }
    );

  } catch (err) {
    console.error('Upload error:', err);
    return m.reply(`🚨 *SYSTEM ERROR:*\nTry again later.`);
  }
};
