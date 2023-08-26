import { Interaction } from "discord.js";
import { handleButtonInteraction } from "./buttonInteraction";
import { ExtendedClient } from "../classes";

export const handleInteraction = async ( client: ExtendedClient, interaction: Interaction ) => {
    if (interaction.isButton()) {
        await handleButtonInteraction(client, interaction)
    }
}