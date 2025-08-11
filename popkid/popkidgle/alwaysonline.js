import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.slice(prefix.length).split(' ')[0].toLowerCase();
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'alwaysonline') return;

  // popkid gle v2
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

  if (['on', 'off'].includes(text.toLowerCase())) {
    const status = text.toLowerCase() === 'on';
    config.ALWAYS_ONLINE = status;

    return sendButtons(
      `🧩 *Always Online Mode*\n\nStatus: ${status ? '🟢 ENABLED' : '🔴 DISABLED'}\nMode: ${status ? 'Connected 24/7 🌐' : 'Idle on Inactivity 💤'}`
    );
  }

  return sendButtons(
    `⚙️ *Usage*\n\nYou can use the buttons below to toggle Always Online Mode.`
  );
};

export default alwaysonlineCommand;
