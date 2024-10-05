const fs = require("fs");
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));

module.exports = {
  name: "admin",
  usedby: 4,
  dev: "Jonell Magallanes",
  onPrefix: true,
  cooldowns: 1,
  info: "Admin and Moderator List",
  hide: true,

  onLaunch: async function ({ api, event, target }) {
    let senderInfo = await api.getUserInfo(event.senderID);
    let senderName = senderInfo[event.senderID].name;

    if (adminConfig.adminUIDs.includes(event.senderID)) {
      let replyUser = event.messageReply ? event.messageReply.senderID : null;

      if (target[0] === 'add') {
        let role = target[1];
        let newUID = target[2] || replyUser;

        if (!newUID) {
          return api.sendMessage("Please specify a UID or reply to a user to add as an admin/mod.", event.threadID);
        }

        if (role === "admin" && !adminConfig.adminUIDs.includes(newUID)) {
          adminConfig.adminUIDs.push(newUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          api.sendMessage(`🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗔𝗱𝗱𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nSuccessfully added new admin UID ${newUID}`, event.threadID, () => {
            process.exit(1);
          });
        } else if (role === "mod" && (!adminConfig.moderatorUIDs || !adminConfig.moderatorUIDs.includes(newUID))) {
          adminConfig.moderatorUIDs = adminConfig.moderatorUIDs || [];
          adminConfig.moderatorUIDs.push(newUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          api.sendMessage(`👮 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿 𝗔𝗱𝗱𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nSuccessfully added new moderator UID ${newUID}`, event.threadID, () => {
            process.exit(1);
          });
        } else {
          api.sendMessage(`UID: ${newUID} is already an ${role}.`, event.threadID);
        }
      } else if (target[0] === 'remove' && target[1] === 'admin' && target[2]) {
        let removeUID = target[2];

        if (adminConfig.adminUIDs.includes(removeUID)) {
          adminConfig.adminUIDs = adminConfig.adminUIDs.filter(uid => uid !== removeUID);
          fs.writeFileSync("admin.json", JSON.stringify(adminConfig, null, 2), "utf8");
          api.sendMessage(`🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗥𝗲𝗺𝗼𝘃𝗲𝗱\n━━━━━━━━━━━━━━━━━━\nSuccessfully removed admin UID ${removeUID}`, event.threadID, () => {
            process.exit(1);
          });
        } else {
          api.sendMessage(`UID: ${removeUID} is not an admin.`, event.threadID);
        }
      } else {
        let adminList = [];
        for (let adminUID of adminConfig.adminUIDs) {
          let adminInfo = await api.getUserInfo(adminUID);
          let adminName = adminInfo[adminUID].name;
          adminList.push(`[ ${adminUID} ] ${adminName}`);
        }

        let moderatorList = [];
        if (adminConfig.moderatorUIDs) {
          for (let modUID of adminConfig.moderatorUIDs) {
            let modInfo = await api.getUserInfo(modUID);
            let modName = modInfo[modUID].name;
            moderatorList.push(`[ ${modUID} ] ${modName}`);
          }
        }

        let message = `👥 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿 𝗟𝗶𝘀𝘁\n━━━━━━━━━━━━━━━━━━\n🛡️ Admins:\n${adminList.join("\n")}\n\n`;
        if (moderatorList.length > 0) {
          message += `👮 Moderators:\n${moderatorList.join("\n")}`;
        } else {
          message += `👮 No moderators assigned.`;
        }

        api.sendMessage(message, event.threadID);
      }
    } else {
      api.sendMessage("🛡️ 𝗨𝗻𝗮𝘂𝘁𝗵𝗼𝗿𝗶𝘇𝗲𝗱 \n━━━━━━━━━━━━━━━━━━\nYou are not authorized to use this command.", event.threadID);
    }
  }
};
