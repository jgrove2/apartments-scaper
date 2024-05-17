import type { Collection, Message, SlashCommandBuilder } from "discord.js";
import type Command from "../classes/Command";
import type Database from "../classes/Database";
import type Logger from "../../../util/classes/Logger";

export default interface ICustomClient {
  discordToken: string | undefined;
  guildId: string | undefined;
  botId: string | undefined;
  commands: Map<string, Command>;
  db: Database;
  logger: Logger;
  messageChannelId: string | undefined;

  Init(): Promise<void>;
  addCommand(command: Command): void;
  onReady(): void;
  registerSlashCommands(): Promise<void>;
  apartmentPreviewTable(apartment: any): string;
  sendTimedMessage(): Promise<void>;
}
