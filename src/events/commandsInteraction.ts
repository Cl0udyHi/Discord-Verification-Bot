import { Events, GuildMember, Interaction, MessageFlags } from "discord.js";
import { commands } from "../handlers/deploy-commands";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      if (interaction.member instanceof GuildMember) {
        await command.execute(interaction);
      } else {
        return await interaction.reply({
          content: "Commands can only be ran on the server",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
