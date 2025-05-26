import { Client } from "discord.js";
import deployCommands from "../handlers/deploy-commands";

const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client<boolean>) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};
