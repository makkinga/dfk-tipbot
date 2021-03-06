const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed}        = require('discord.js')
const {Config, Lang}        = require('../utils')
const git                   = require('git-rev-sync')
const moment                = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`about`)
        .setDescription(`About this bot`),

    async execute(interaction)
    {
        // Defer reply
        await interaction.deferReply({ephemeral: true})

        // Send embed
        moment.locale(Config.get(`locales.${interaction.guildId}`) ?? 'en')
        const embed = new MessageEmbed()
            .setColor(Config.get('colors.primary'))
            .setAuthor({name: `${Config.get('bot.name')} | ${Lang.trans(interaction, 'about.title')}`, iconURL: Config.get('bot.icon')})
            .setDescription(Lang.trans(interaction, 'about.description', {bot: Config.get('bot.name'), user: '<@490122972124938240>'}))
            .addField(Lang.trans(interaction, 'about.version'), git.tag(), true)
            .addField(Lang.trans(interaction, 'about.last_updated'), moment(git.date()).fromNow(), true)
            .addField(Lang.trans(interaction, 'about.license'), 'MIT', true)
            .addField(Lang.trans(interaction, 'about.source'), `https://github.com/makkinga/dfk-tipbot`)
            .addField(Lang.trans(interaction, 'about.bugs_features_title'), `${Lang.trans(interaction, 'about.bugs_features_description')}: https://github.com/makkinga/dfk-tipbot/issues/new/choose`)
            .addField(Lang.trans(interaction, 'about.coffee_title'), Lang.trans(interaction, 'about.coffee_description', {bot: Config.get('bot.name')}) + '```' + '0xb2689E31b229139B52006b6Ec22C991A66c9D257' + '```')
            .addField(Lang.trans(interaction, 'about.contributors'), `<@221734683417772042>, <@607946034546475042>, <@416316384650330115>, <@891355078416543774>, <@842662223721267210>, ${Lang.trans(interaction, 'and')} <@941244290946965584>`)
            .addField(Lang.trans(interaction, 'about.roadmap'), `https://github.com/makkinga/dfk-tipbot/projects/1`)

        await interaction.editReply({embeds: [embed], ephemeral: true})
    },
}