import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  Message,
  TextChannel,
  ActionRowBuilder,
  Events,
  EmbedBuilder,
  Colors,
} from "discord.js";

module.exports = {
  name: Events.MessageCreate,
  execute(message: Message) {
    const { member, channel } = message;

    if (message.author.bot) return;
    if (message.content !== "!verify") return;
    if (!message.member?.permissions.has("Administrator")) return;

    const embed = new EmbedBuilder()
      .setDescription(
        "1. ادخل هايبكسل واكتب `/socials` في الشات.\n" +
          "2. اضغط على علامة الديسكورد وحط اسمك في الديسكورد.\n" +
          "3. بعد ما تربطهم، اضغط زر الي تحت.\n"
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/838044484843077663/1000115758585610500/verify.gif?ex=68341222&is=6832c0a2&hm=19571430bbf89f23b8a9fef59b5169bea6d683ecef98b86f19ec403ccd0ff874&"
      )
      .setFooter({
        text: "هذا الشي يساعدنا نتأكد منك ونعطيك صلاحيات السيرفر.",
      })
      .setColor(Colors.DarkGreen);

    const button = new ButtonBuilder()
      .setCustomId("verify")
      .setLabel("Verify")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    (channel as TextChannel).send({
      embeds: [embed],
      components: [row],
    });
  },
};
