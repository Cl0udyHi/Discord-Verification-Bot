import "dotenv/config";
import { Client, Collection } from "discord.js";
import deployCommands from "./handlers/deploy-commands";
import handleEvents from "./handlers/handle-events";

// Extend the Client interface to include 'hi'
declare module "discord.js" {
  interface Client {
    attempts: Collection<string, { attempts: number; lastAttempt: string }>;
  }
}

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
});

client.attempts = new Collection();

deployCommands(client);
handleEvents(client);

client.login(process.env.BOT_TOKEN);
