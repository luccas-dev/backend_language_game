const express = require('express')
const gameDataRouter = express.Router()
const database = require('../config/db')

gameDataRouter.post('/save', async (req, res) => {
    const {player_name, difficulty, correct_words, wrong_words} = req.body

    try {
        await database.query('INSERT INTO game_data (player_name, correct_words, wrong_words, difficulty) VALUES (?, ?, ?, ?)', [player_name, correct_words, wrong_words, difficulty])

        res.status(200).send('DADOS SALVOS')
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = gameDataRouter