const fs = require("fs");
const path = require("path");
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
    name: "help",
    usedby: 0,
    info: "display available commands",
    dev: "Jonell Magallanes",
    onPrefix: true,
    usages: "help",
    cooldowns: 10,

    onLaunch: async function ({ api, event, target }) {
        const cmdsPath = path.join(__dirname, '');
        const commandFiles = fs.readdirSync(cmdsPath).filter(file => file.endsWith('.js'));

        if (target[0]) {
            const commandName = target[0];
            const commandFile = commandFiles.find(file => file === `${commandName}.js`);
            if (commandFile) {
                const commandInfo = require(path.join(cmdsPath, commandFile));
                const permissionText = commandInfo.usedby === undefined ? "Unknown" :
                                       commandInfo.usedby === 0 ? "Member" :
                                       commandInfo.usedby === 1 ? "Admin Group" :
                                       commandInfo.usedby === 2 ? "Global Admin" :
                                       commandInfo.usedby === 3 ? "Moderator" :
                                       commandInfo.usedby === 4 ? "Admin and Moderator" : "Unknown";

                const helpMessage = `╭─『 ${commandInfo.name || "Unknown"} 』\n` +
                    `│✧ Name: ${commandInfo.name || "Unknown"}\n` +
                    `│✧ Permission: ${permissionText}\n` +
                    `│✧ Developer: ${commandInfo.dev || "Unknown"}\n` +
                    `│✧ Cooldown: ${commandInfo.cooldowns || "Unknown"} seconds\n` +
                    `│✧ Description: ${commandInfo.info || "Unknown"}\n` +
                    `│✧ Need Prefix: ${commandInfo.onPrefix !== undefined ? commandInfo.onPrefix : "Unknown"}\n` +
                    `╰───────────◊`;
                return api.sendMessage(helpMessage, event.threadID, event.messageID).catch(error => console.error('Error sending message:', error));
            } else {
                return api.sendMessage(`Command "${commandName}" not found.`, event.threadID).catch(error => console.error('Error sending message:', error));
            }
        }

        const visibleCommandFiles = commandFiles.filter(file => {
            const command = require(path.join(cmdsPath, file));
            return !command.hide;
        });

        const commandsPerPage = 10;
        const totalPages = Math.ceil(visibleCommandFiles.length / commandsPerPage);
        let page = parseInt(target[0]);

        if (isNaN(page) || page <= 0 || page > totalPages) {
            page = 1;
        }

        const startIndex = (page - 1) * commandsPerPage;
        const endIndex = Math.min(startIndex + commandsPerPage, visibleCommandFiles.length);

        let helpMessage = `╭─『 Commands List 』\n`;
        const displayedCommands = visibleCommandFiles.slice(startIndex, endIndex);

        displayedCommands.forEach(file => {
            const commandInfo = require(path.join(cmdsPath, file));
            helpMessage += `│✧ ${commandInfo.name || "Unknown"}\n`;
        });

        helpMessage += `╰───────────◊\n\n(Page ${page}/${totalPages})\nType ${adminConfig.prefix}help <page number> to see more commands.\n\nDev: ${adminConfig.ownerName}`;

        api.shareContact(helpMessage, api.getCurrentUserID(), event.threadID) 
        
    }
};