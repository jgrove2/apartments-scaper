import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface ICommands {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): any;
}
