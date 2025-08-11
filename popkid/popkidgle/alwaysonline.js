import config from '../../config.cjs';

const alwaysonlineCommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.slice(prefix.length).split(' ')[0].toLowerCase();
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd !== 'alwaysonline') return;

    const sendStyled = async (txt, buttons = []) => {
        await Matrix.sendMessage(m.from, {
            text: txt,
            buttons: buttons,
            footer: "⚡ Popkid-Xmd",
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
        return sendStyled("🚫 *Access Denied*\nOnly the bot owner can use this command.");
    }

    if (['on', 'off'].includes(text.toLowerCase())) {
        const status = text.toLowerCase() === 'on';
        config.ALWAYS_ONLINE = status;

        return sendStyled(
            `🧩 *Always Online Mode*\n\nStatus: ${status ? '🟢 ENABLED' : '🔴 DISABLED'}\nMode: ${status ? 'Connected 24/7 🌐' : 'Idle on Inactivity 💤'}`,
            [
                { buttonId: `${prefix}alwaysonline on`, buttonText: { displayText: '🟢 Enable' }, type: 1 },
                { buttonId: `${prefix}alwaysonline off`, buttonText: { displayText: '🔴 Disable' }, type: 1 }
            ]
        );
    }

    return sendStyled(
        `⚙️ *Usage*\n\n.alwaysonline on — 🟢 Enable 24/7\n.alwaysonline off — 🔴 Disable it`,
        [
            { buttonId: `${prefix}alwaysonline on`, buttonText: { displayText: '🟢 Enable' }, type: 1 },
            { buttonId: `${prefix}alwaysonline off`, buttonText: { displayText: '🔴 Disable' }, type: 1 }
        ]
    );
};

export default alwaysonlineCommand;
