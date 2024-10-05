const axios = require('axios');

module.exports = {
    name: "embed",
    usedby: 0,
    info: "Embed URLs or search for embedded files",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 6,


onLaunch: async function ({ api, event, target }) {
    const commandType = target[0];

    if (commandType === "search") {
        const searchTerm = target.slice(1).join(' ');

        if (!searchTerm) {
            return api.sendMessage("Please provide a search term.", event.threadID);
        }

        const hs = await api.sendMessage("Embedding.....", event.threadID, event.messageID);
        try {
            const response = await axios.get(`https://ccprojectprivilege.adaptable.app/embed/search?search=${encodeURIComponent(searchTerm)}`);
            const files = response.data.files;

            if (response.data.success && files.length > 0) {
                const filePaths = files.map(file => `https://ccprojectprivilege.adaptable.app/${file}.html`).join('\n');
                api.editMessage(`𝗘𝗺𝗯𝗲𝗱𝗱𝗲𝗱 𝗖𝗖 𝗣𝗥𝗢𝗝𝗘𝗖𝗧𝗦 𝗦𝗲𝗮𝗿𝗰𝗵\n━━━━━━━━━━━━━━━━━━\nSearch Result\n${filePaths}`, hs.messageID, event.threadID);
            } else {
                api.editMessage("No files found for the given search term.", hs.messageID, event.threadID);
            }
        } catch (error) {
            api.editMessage(`Error: ${error.message}`, hs.messageID, event.threadID);
        }

    } else {
        const input = target.join(' ');
        const [urlToEmbed, nameTitle] = input.split('|').map(part => part.trim());

        if (!urlToEmbed || !nameTitle) {
            return api.sendMessage("Please provide a valid URL and name, separated by '|'.", event.threadID);
        }

        const hs = await api.sendMessage("Embedding.....", event.threadID, event.messageID);
        try {
            const response = await axios.get(`https://ccprojectprivilege.adaptable.app/embed?url=${encodeURIComponent(urlToEmbed)}&name=${encodeURIComponent(nameTitle)}`);
            const filePath = response.data.filePath;

            if (response.data.success) {
                api.editMessage(`𝗘𝗺𝗯𝗲𝗱𝗱𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n━━━━━━━━━━━━━━━━━━\nEmbed successful!\n🌐 URL Embedded: ${filePath}`, hs.messageID, event.threadID, event.messageID);
            } else {
                api.sendMessage("Failed to embed URL.", event.threadID);
            }
        } catch (error) {
            api.editMessage(`Error: ${error.message}`, hs.messageID, event.threadID);
        }
    }
}
}