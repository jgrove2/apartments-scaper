import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import type ICommands from "../interfaces/ICommand";

export default class Command implements ICommands{
    data: SlashCommandBuilder;

    constructor(name: string, description: string){
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description);
    }

    async execute(interaction: CommandInteraction) {
        throw new Error("Method not implemented.");
    }

}