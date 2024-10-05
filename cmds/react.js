module.exports = {
    name: "react",
    usedby: 0,
    info: "test",
    onPrefix: true,
    cooldowns: 6,

    callReact: async function ({ reaction, event, api }) {
        const { threadID } = event;

        const responseMessage = "Successfully reacted";
        api.sendMessage(responseMessage, threadID);
    },

    onLaunch: async function ({ event, api }) {
        const { threadID, messageID } = event;
        const promptMessage = "React to this message";

        api.sendMessage(promptMessage, threadID, async (err, info) => {
            if (!err) {
                const messageID = info.messageID;

                global.client.callReact.push({ messageID, name: this.name });
            }
        });
    }
};
