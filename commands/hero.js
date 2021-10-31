const {Command}             = require('discord-akairo')
const axios                 = require("axios")
const table                 = require('text-table')
const {Config, React, Hero} = require("../utils")

class HeroCommand extends Command
{
    constructor()
    {
        super('hero', {
            aliases  : ['hero'],
            args     : [
                {
                    id     : 'id',
                    type   : 'number',
                    default: 1,
                },
            ],
            ratelimit: 1,
        })
    }

    async exec(message, args)
    {
        await React.processing(message)

        const response = await axios({
            url   : 'https://graph.defikingdoms.com/subgraphs/name/defikingdoms/apiv5',
            method: 'post',
            data  : {
                query    : `
                    query hero($id: ID!) {
                      hero(id: $id) {
                      generation
                        firstName
                        lastName
                        rarity
                        visualGenes
                        strength
                        agility
                        endurance
                        wisdom
                        dexterity
                        vitality
                        stamina
                        luck
                        hp
                        mp
                        xp
                        level
                        profession
                        gender
                        gardening
                        foraging
                        fishing
                        mining
                      }
                    }
                `,
                variables: {
                    "id": `${args.id}`
                }
            }
        })
        const hero     = response.data.data.hero
        const name     = Hero.getFullName(hero.gender, hero.firstName, hero.lastName)

        const embed = this.client.util.embed()
            .setColor(Hero.getColor(hero.rarity))
            .setTitle(`Hero #${args.id}`)
            .setThumbnail('https://cdn.discordapp.com/icons/861728723991527464/a_3480dd8a8f41d429341272626dfc61db.webp?size=160')
            .addField(`Name`, name)
            .addField(`Gender`, hero.gender)
            .addFields(
                {name: `Generation`, value: hero.generation, inline: true},
                {name: `Rarity`, value: hero.rarity, inline: true},
            )
            .addFields(
                {name: `Level`, value: hero.level, inline: true},
                {name: `HP`, value: hero.hp, inline: true},
                {name: `MP`, value: hero.mp, inline: true},
            )

        let stats = [
            ['Strength', hero.strength],
            ['Agility', hero.agility],
            ['Endurance', hero.endurance],
            ['Wisdom', hero.wisdom],
            ['Dexterity', hero.dexterity],
            ['Vitality', hero.vitality],
            ['Stamina', hero.stamina],
            ['Luck', hero.luck],
        ]
        embed.addField(`Stats`, '```' + table(stats) + '```')

        let professions = [
            ['Fishing', hero.fishing],
            ['Foraging', hero.foraging],
            ['Gardening', hero.gardening],
            ['Mining', hero.mining],
        ]
        embed.addField(`Professions`, '```' + table(professions) + '```')

        await message.channel.send(embed)
        await React.done(message)
    }
}

module.exports = HeroCommand