import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { read, write } from "../../handlers/verify";
import { verify_id } from "../../../data.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unverify")
    .setDescription("Unlink your discord and minecraft accounts"),
  async execute(interaction: ChatInputCommandInteraction) {
    const { user, member } = interaction;

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const data = read();
    const now = new Date();
    const LastUnverified = new Date(data[user.id].LastUnverified);
    const timestamp = Math.floor((LastUnverified.getTime() + 86400000) / 1000);

    if (
      now.getTime() - LastUnverified.getTime() < 86400000 &&
      !(member as GuildMember).permissions.has("Administrator")
    ) {
      return await interaction.editReply({
        content: `⏳ You can unverify only once every 24 hours. Please try again <t:${timestamp}:R>.`,
      });
    }

    if (data[user.id].uuid) {
      data[user.id] = {
        LastUnverified: new Date().toISOString(),
      };

      write(data);

      (member as GuildMember).roles.remove(verify_id).catch((err) => {
        console.error("Failed to remove role:", err);
        throw err;
      });

      return await interaction.editReply({
        content: "✅ Successfully unverified your account.",
      });
    } else {
      return await interaction.editReply({
        content: "❌ You are not verified, so there is nothing to unlink.",
      });
    }
  },
};
