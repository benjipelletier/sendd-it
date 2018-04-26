const nouns = require('./nouns')
const adj = require('./adjectives.js')

console.log(adj.words[Math.floor(Math.random()*adj.words.length)] + nouns.words[Math.floor(Math.random()*nouns.words.length)])


