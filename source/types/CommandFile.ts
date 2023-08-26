import * as discord from 'discord.js'
import { Client } from 'clashofclans.js'
import { ExtendedClient } from '../classes'

export interface CommandFile {
    builder: discord.SlashCommandBuilder,
    execute: ( client: ExtendedClient, clashClient: Client, interaction: discord.ChatInputCommandInteraction, msgId: number ) => Promise<void>
    perms?: {
        leader?: boolean,
        coLeader?: boolean,
        elder?: boolean,
        member?: boolean
    }
}