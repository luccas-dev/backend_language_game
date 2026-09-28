const express = require('express')
const router = express.Router()
const database = require('../config/db')

// ROTA PARA SELECIONAR UMA PALAVRA ALEATORIA
router.get('/', async (req, res) => {
    try {
        const [random_word] = await database.query('SELECT id_word, word, difficulty FROM korean_words WHERE difficulty = ? ORDER BY RAND() LIMIT 1', req.query.difficulty)
        res.json(random_word[0])
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

// ROTA PARA VALIDAR RESPOSTA
router.post('/validate', async (req, res) => {
    const { id_word, userResponse } = req.body

    if(!id_word || !userResponse) {
        return res.status(400).send("ID e Resposta são obrigatórios!")
    }
    
    try {
        const [word_selected] = await database.query('SELECT accepted_translations FROM korean_words WHERE id_word = ?', [id_word])

        if(word_selected.length === 0) {
            return res.status(400).send('Palavra não encontrada.')
        }

        const translations = word_selected[0].accepted_translations
        const lastResponse = userResponse.toLowerCase().trim()

        const correct = translations.includes(lastResponse)

        res.json({correct: correct})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/save', async (req, res) => {
    const {player_name, difficulty, correct_words, wrong_words} = req.body
    const dados = [player_name, correct_words, wrong_words, difficulty]

    try {
        await database.query('INSERT INTO game_data (player_name, correct_words, wrong_words, difficulty) VALUES (?, ?, ?, ?)', dados)

        res.status(200).send('DADOS SALVOS')
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router