import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;

  // Get message text or button ID if it's a button response
  let body = '';
  if (m.message?.buttonsResponseMessage?.selectedButtonId) {
    body = m.message.buttonsResponseMessage.selectedButtonId;
  } else if (m.body) {
    body = m.body;
  }

  if (!body.startsWith(prefix)) return;

  const cmd = body.slice(prefix.length).split(' ')[0].toLowerCase();
  const text = body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd !== 'alwaysonline') return;

  // Helper to send buttons with a message
  const sendButtons = async (txt) => {
    const buttons = [
      { buttonId: `${prefix}alwaysonline on`, buttonText: { displayText: '🟢 Enable' }, type: 1 },
      { buttonId: `${prefix}alwaysonline off`, buttonText: { displayText: '🔴 Disable' }, type: 1 }
    ];
    await Matrix.sendMessage(m.from, {
      text: txt,
      buttons,
      headerType: 1,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420342566562@newsletter",
          newsletterName: "Popkid-Xmd"
        }
      }
    });
  };

  if (!isCreator) {
    return sendButtons(`🚫 *Access Denied*\nOnly the bot owner can use this command.`);
  }

  if (!text) {
    // No argument — just send the buttons prompt
    return sendButtons(
      `⚙️ *Always Online Mode*\n\nCurrent Status: ${
        config.ALWAYS_ONLINE ? '🟢 ENABLED' : '🔴 DISABLED'
      }\n\nUse the buttons below to toggle the mode.`
    );
  }

  if (text === 'on' || text === 'off') {
    const status = text === 'on';
    config.ALWAYS_ONLINE = status;

    return sendButtons(
      `🧩 *Always Online Mode*\n\nStatus: ${
        status ? '🟢 ENABLED' : '🔴 DISABLED'
      }\nMode: ${status ? 'Connected 24/7 🌐' : 'Idle on Inactivity 💤'}`
    );
  }

  // If invalid argument
  return sendButtons(
    `⚠️ Invalid argument!\n\nUsage:\n${prefix}alwaysonline on\n${prefix}alwaysonline off`
  );
};

export default alwaysonlineCommand;
