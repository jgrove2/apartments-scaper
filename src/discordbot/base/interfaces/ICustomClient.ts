import type { Collection, Message, SlashCommandBuilder } from "discord.js";
import type Command from "../classes/Command";

export default interface ICustomClient {
  discordToken: string | undefined;
  guildId: string | undefined;
  botId: string | undefined;
  commands: Map<string, Command>;

  Init(): Promise<void>;
  addCommand(command: Command): void;
  onReady(): void;
  registerSlashCommands(): Promise<void>;
}
