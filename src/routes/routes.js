const express = require('express');
const VoteController = require('../controllers/voteController');
const Database = require('../models/database');
const VoteService = require('../services/voteService');

const router = express.Router();
const database = new Database();
const voteService = new VoteService(database);
const voteController = new VoteController(voteService);

router.post('/votes', (req, res) => voteController.addVote(req, res));
router.get('/results', (req, res) => voteController.getResults(req, res));
router.get('/leading-market', (req, res) => voteController.getLeadingMarket(req, res));
router.get('/markets', (req, res) => voteController.getMarkets(req, res)); // Nova rota
router.get('/clients/next-id', (req, res) => {
    const nextClientId = voteService.generateClientId();
    res.json({ nextClientId });
});

module.exports = router;
