import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import { DateTime } from "luxon";

import {Activity} from "../orm";

const usedRecently: Set<string> = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_history')
        .setDescription('Get the last 10 user status updates.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the options of')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user", true)
        await interaction.deferReply()
        const data = await Activity.findAll({where: {userId: user.id}, order: [['createdAt', 'DESC']], limit: 10});
        if (data.length === 0){
            return await interaction.followUp("This user has no presence history!")
        } else {
            const items = data.map((item) => {
                let detailString = "";
                if (item.data){
                    detailString = `: ${item.data}`
                }
                return `${DateTime.fromJSDate(item.createdAt).setLocale("en-US").toLocaleString({ dateStyle: 'long', timeStyle: 'long' })}: **${item.type}**: ${item.name}${detailString}`
            })
            return await interaction.followUp(`Last **${items.length}** items for ${user.toString()}:\n${items.join('\n')}`)
        }
    },
};
