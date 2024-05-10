import type { CommandInteraction } from "discord.js";
import Command from "../Command";

export default class Ping extends Command {
  constructor() {
    super("ping", "Replies with pong");
  }
  async execute(interaction: CommandInteraction) {
    await interaction.reply(`[Link](https://google.com)`);
  }
}
