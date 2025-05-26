import {
  Events,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  ButtonInteraction,
  ModalSubmitInteraction,
  MessageFlags,
} from "discord.js";
import verify from "../handlers/verify";
import { inflateSync } from "zlib";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const { user, member } = interaction;

    if (interaction.isButton()) {
      if ((interaction as ButtonInteraction).customId !== "verify") return;

      const aa = new ModalBuilder()
        .setTitle("Verification")
        .setCustomId("verifyModal")
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId("verifyInput")
              .setLabel("Minecraft Username")
              .setPlaceholder("Steve")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );

      await (interaction as ButtonInteraction).showModal(aa);

      return;
    }

    if (
      interaction instanceof ModalSubmitInteraction &&
      interaction.customId === "verifyModal"
    ) {
      await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

      let input = interaction.fields.getTextInputValue("verifyInput");

      if (input) await verify(input, interaction);

      return;
    }
  },
};
