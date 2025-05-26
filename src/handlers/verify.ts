import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  ModalSubmitInteraction,
} from "discord.js";
import fetchData, { fetchWithRetries } from "./fetchData";
import { client } from "../index";
import { verify_id } from "../../data.json";
import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "../verify.json");

function write(data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing file:", error);
    return false;
  }
}

function read() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

function linkAccounts(id: string, uuid: string) {
  const data = read();

  data[id] = {
    uuid: uuid,
    LastUnverified: data[id]?.LastUnverified || null,
  };

  write(data);
}

export default async function verify(
  input: string,
  interaction: ChatInputCommandInteraction | ModalSubmitInteraction
) {
  const { user, member } = interaction;

  const userData = client.attempts.get(user.id);

  const data = read();
  if (data[user.id]?.uuid) {
    return interaction.editReply({
      content: `❌ You are already verified. To link a different Minecraft account, please use the \`/unverify\` command first.`,
    });
  }

  const now = new Date();
  const lastAttempt = userData ? new Date(userData.lastAttempt) : null;

  if (!userData || now.getTime() - (lastAttempt?.getTime() || 0) > 300000) {
    client.attempts.set(user.id, {
      attempts: 1,
      lastAttempt: new Date().toISOString(),
    });
  } else if (
    userData &&
    userData?.attempts >= 3 &&
    !(member as GuildMember).permissions.has("Administrator")
  )
    return await interaction.editReply({
      content: `⏳ You have been rate limited due to too many failed attempts. Please wait 5 minutes before trying again.`,
    });
  else if (userData) {
    client.attempts.set(user.id, {
      attempts: userData.attempts + 1,
      lastAttempt: new Date().toISOString(),
    });
  }

  const PlayerData = await fetchWithRetries(
    `https://api.mojang.com/users/profiles/minecraft/${input}`
  );

  if (!PlayerData.success && PlayerData.status == "404") {
    return await interaction.editReply({
      content: `❌ Invalid Minecraft username`,
    });
  }

  if (!PlayerData.success) {
    return await interaction.editReply({
      content:
        "❌ Something went wrong during the verification process. Please try again later." +
        `\n-# Details: ${PlayerData.error}`,
    });
  }

  if (!process.env.HYPIXEL_API_KEY) {
    return await interaction.editReply({
      content: "❌ Hypixel API key is not configured on the server.",
    });
  }

  const HypixelPlayerData = await fetchData(
    `https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&uuid=${PlayerData.data?.id}`
  );

  if (!HypixelPlayerData.success)
    return await interaction.editReply({
      content:
        `❌ Unable to retrieve your Hypixel player data at this time.` +
        `\n-# Details: ${HypixelPlayerData.error || "Unknown error occurred."}`,
    });

  const discord =
    HypixelPlayerData.data?.player?.socialMedia?.links?.["DISCORD"];
  if (!discord) {
    return await interaction.editReply({
      content: `❌ Your Minecraft account does not have a Discord linked.`,
    });
  }

  if (discord !== user.username)
    return await interaction.editReply({
      content:
        `❌ Your Discord username does not match the Discord account linked to this Minecraft player.\n` +
        `**Your Discord**: ${user.username}\n` +
        `**Linked Discord**: ${discord}`,
    });

  try {
    await Promise.all([
      (member as GuildMember).roles.add(verify_id),
      (member as GuildMember).setNickname(PlayerData?.data?.name),
    ]);
  } catch (err) {}

  linkAccounts(user.id, PlayerData.data.id);

  await interaction.editReply({
    content: `✅ Success! Your account was linked with **Minecraft Account:** \`${PlayerData.data.name}\`\nYou now have access to the server. Welcome!`,
  });

  return;
}

export { write, read };
