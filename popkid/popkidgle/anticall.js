import config from '../../config.cjs';

const anticallcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // === Step 1: Show buttons if just "anticall" is typed ===
  if (cmd === 'anticall' && !text) {
    if (!isCreator)
      return m.reply(`*⛔ ACCESS DENIED!*\n\nOnly the *bot owner* can use this command.`);

    return await Matrix.sendMessage(m.from, {
      text: `⚙️ *Anti-Call Control*\n\n💡 Choose an option below to toggle Anti-Call:`,
      buttons: [
        { buttonId: `${prefix}anticall on`, buttonText: { displayText: '🚫 Enable Anti-Call' }, type: 1 },
        { buttonId: `${prefix}anticall off`, buttonText: { displayText: '✅ Disable Anti-Call' }, type: 1 }
      ],
      headerType: 1,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "POPKID-XTECH ⚙️",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });
  }

  // === Step 2: Handle toggle logic ===
  if (cmd === 'anticall' && text) {
    if (!isCreator)
      return m.reply(`*⛔ ACCESS DENIED!*\n\nOnly the *bot owner* can use this command.`);

    let responseMessage = '';

    if (text === 'on') {
      config.REJECT_CALL = true;
      responseMessage = `
╭─❍「 🚫 ANTI-CALL ENABLED 」❍
│ ✅ All incoming calls will now be *auto-rejected*
│ 🔒 This helps keep the bot stable and safe!
│
│  🚀 Powered by *POPKID-XTECH*
╰─────────────────────⧘
      `.trim();
    } else if (text === 'off') {
      config.REJECT_CALL = false;
      responseMessage = `
╭─❍「 ✅ ANTI-CALL DISABLED 」❍
│ ❌ Incoming calls will *no longer* be auto-rejected.
│ 📞 Use responsibly to avoid blocks.
│
│  🚀 Powered by *POPKID-XTECH*
╰─────────────────────⧘
      `.trim();
    } else {
      responseMessage = `
╭─❍「 📛 INVALID USAGE 」❍
│ Please choose an option using the buttons.
│
│  🚀 Powered by *POPKID-XTECH*
╰─────────────────────⧘
      `.trim();
    }

    return await Matrix.sendMessage(m.from, {
      text: responseMessage,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "POPKID-XTECH ⚙️",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });
  }
};

export default anticallcommand;
