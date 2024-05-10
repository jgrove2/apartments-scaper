import type { CommandInteraction } from "discord.js";
import Command from "../Command";
import Database from "../Database";

export default class Ping extends Command {
  db: Database;
  constructor() {
    super(
      "view-all",
      "Replies with a ascii table of all available apartments in your area"
    );
    this.db = new Database();
  }
  async execute(interaction: CommandInteraction) {
    const table_string = this.db.getAllData();
    await interaction.reply("```" + table_string + "```");
  }
}
