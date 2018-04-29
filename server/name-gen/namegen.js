const shuffle = require('shuffle-array')
const nouns = require('./nouns').words.slice()
const adj = require('./adjectives.js').words.slice()

let names = []

adj.forEach((adjective) => {
    nouns.forEach((noun) => {
        names.push(`${adjective}${noun}`)
    })
})

shuffle(names)

exports.commentNames = names