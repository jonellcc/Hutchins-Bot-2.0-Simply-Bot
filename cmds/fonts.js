module.exports = {
    name: "fonts",
    onPrefix: true,
    onLaunch: async function ({ api, event }) {
        const threadID = event.threadID;

        const boldMessage = global.fonts.bold("Hello, this is bold!");
        const italicMessage = global.fonts.italic("This is italic.");
        const monospaceMessage = global.fonts.monospace("Monospace text.");
        const boldItalicMessage = global.fonts.boldItalic("Bold Italic text.");

        await api.sendMessage(`${boldMessage}\n${italicMessage}\n${monospaceMessage}\n${boldItalicMessage}`, threadID);
    }
};
