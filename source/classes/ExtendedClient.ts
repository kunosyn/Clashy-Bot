import * as discord from 'discord.js'

export class ExtendedClient extends discord.Client {
    public commands: discord.Collection<string, any>
    
    constructor (options: discord.ClientOptions) {
        super(options)
        this.commands = new discord.Collection()
    }
}
