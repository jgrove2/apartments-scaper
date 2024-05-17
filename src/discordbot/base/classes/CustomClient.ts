import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  InteractionCollector,
  Message,
  REST,
  Routes,
  SlashCommandBuilder,
  TextChannel,
  time,
} from "discord.js";
import type ICustomClient from "../interfaces/ICustomClient";
import type Command from "./Command";
import Ping from "./commands/Ping";
import ViewAll from "./commands/ViewAll";
import { CronJob } from "cron";
import Database from "./Database";
import Logger from "../../../util/classes/Logger";
import { AsciiTable3 } from "ascii-table3";

export default class CustomClient extends Client implements ICustomClient {
  db: Database;
  discordToken: string | undefined;
  commands: Map<string, Command>;
  guildId: string | undefined;
  botId: string | undefined;
  logger: Logger;
  messageChannelId: string | undefined;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
      ],
    });

    this.discordToken = Bun.env.DISCORD_TOKEN;
    this.botId = Bun.env.BOT_ID;
    this.guildId = Bun.env.GUILD_ID;
    this.db = new Database();
    this.commands = new Collection();
    this.logger = new Logger();
    this.messageChannelId = Bun.env.CHANNEL_ID;

    this.on("ready", this.onReady.bind(this));
    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      console.log("getting interaction");
      const { commandName } = interaction;
      var command = this.commands.get(commandName);
      if (command != undefined) await command.execute(interaction);
      else interaction.reply("Nothing exists for that command");
      console.log("executed");
    });
  }
  async registerSlashCommands(): Promise<void> {
    if (
      this.discordToken == undefined ||
      this.guildId == undefined ||
      this.botId == undefined
    )
      return;
    const rest = new REST({ version: "10" }).setToken(this.discordToken);
    try {
      const commandList = Array.from(
        this.commands,
        ([name, value]) => value.data
      );
      console.log(
        `Started refreshing ${commandList.length} application (/) commands.`
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(this.botId, this.guildId),
        { body: commandList }
      );
    } catch (err) {
      console.error(err);
    }
  }
  onReady(): void {
    console.log(`Logged in as ${this.user?.tag}`);
    this.sendTimedMessage();
    // this.messageAboutNewApartments();
  }
  addCommand(command: Command) {
    this.commands.set(command.data.name, command);
  }
  async Init(): Promise<void> {
    this.login(this.discordToken)
      .then(() => console.log("Logged in!"))
      .catch((err) => console.error(err));

    this.addCommand(new Ping());
    this.addCommand(new ViewAll());

    await this.registerSlashCommands();
  }

  async sendTimedMessage(): Promise<void> {
    // Retrieve the guild and channel
    const messageChannel = this.channels.cache.get(
      this.messageChannelId ?? ""
    ) as TextChannel;
    setInterval(async () => {
      const result = await this.db.selectNewApartments();
      result.forEach((apartment: any) => {
        messageChannel.send(
          "-------------------------------------------------------------------------------"
        );
        messageChannel.send(apartment["url"]);
        messageChannel.send(
          "```" + this.apartmentPreviewTable(apartment) + "```"
        );
        messageChannel.send(
          "-------------------------------------------------------------------------------"
        );
      });
      this.db.updateAllOldApartmentsToOld();
    }, 1000 * 60 * 60);
  }

  apartmentPreviewTable(apartment: any): string {
    let resultString = "";
    let table = new AsciiTable3().setHeading(
      "Address",
      "Price",
      "Bedrooms",
      "Bathrooms",
      "New"
    );
    table.addRow(
      `${apartment["address"]}`,
      `$${apartment["price"]}`,
      apartment["bedrooms"],
      apartment["bathrooms"],
      apartment["new"] == 1 ? "True" : "False"
    );

    return table.toString();
  }
}
