import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import verify from "../../handlers/verify";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Link your discord and minecraft accounts")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter your Minecraft username")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.getString("username");

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    if (input) await verify(input, interaction);
  },
};
