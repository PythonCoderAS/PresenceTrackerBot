import {Client, Collection, Intents} from "discord.js";
import {Activity, init} from "./orm"
import {DateTime} from "luxon";

const {discord} = require("./config.json");
const fs = require('fs');

const client = new Client({
    intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS],
    partials: ["USER", "GUILD_MEMBER"]
});

client["commands"] = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client["commands"].set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isCommand()) return;

        // console.debug("%s%s ran %s", interaction.user.username, interaction.user.discriminator, interaction.commandName);

        const command = client["commands"].get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    } catch (e) {
        console.error(e);
    }
});

let activityCache: { [key: string]: number } = {}
let lastChecked = 0;

client.on("presenceUpdate", (oldPresence, newPresence) => {
    if (newPresence.user && newPresence.user.bot) {
        return;
    }
    if (newPresence.activities && newPresence.activities.length > 0) {
        for (const activity of newPresence.activities) {
            if (activity.type !== "CUSTOM") {
                const cacheId = newPresence.userId + activity.name + activity.details?.trim();
                const currentTimeSecs = DateTime.now().setZone("America/New_York").toSeconds();
                const diff = currentTimeSecs - (activityCache[cacheId] || 0)
                if (diff > 300) { // 60 * 5 = 300
                    activityCache[cacheId] = currentTimeSecs;
                    Activity.create({
                        userId: newPresence.userId,
                        name: activity.name,
                        data: activity.details,
                        type: activity.type
                    }).catch((reason => console.error(reason)))
                }
            }
        }
    }
    const currentTimeSecs = DateTime.now().setZone("America/New_York").toSeconds();
    if (Object.keys(activityCache).length > 1000) {
        if (currentTimeSecs - lastChecked > 300) {
            for (const item of Object.entries(activityCache)) {
                if (currentTimeSecs - item[1] > 300) {
                    delete activityCache[item[0]];
                }
            }
        }
    }
})

// Login to Discord with your client's token
init().then(function () {
    client.login(discord.token).catch(e => console.error(e));
})