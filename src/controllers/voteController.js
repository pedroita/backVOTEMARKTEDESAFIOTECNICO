class VoteController {
    constructor(voteService) {
        this.voteService = voteService;
    }

    addVote(req, res) {
        try {
            const vote = req.body;
            const newVote = this.voteService.addVote(vote);
            res.status(201).json(newVote); // Código 201 Created para sucesso na criação de um novo recurso
        } catch (error) {
            res.status(400).json({ error: error.message }); // Código 400 Bad Request para erros de solicitação
        }
    }

    getResults(req, res) {
        try {
            const results = this.voteService.getResults();
            res.status(200).json(results); // Código 200 OK para sucesso na obtenção dos resultados
        } catch (error) {
            res.status(500).json({ error: error.message }); // Código 500 Internal Server Error para erros no servidor
        }
    }

    getLeadingMarket(req, res) {
        try {
            const leadingMarket = this.voteService.getLeadingMarket();
            res.status(200).json(leadingMarket); // Código 200 OK para sucesso na obtenção do mercado líder
        } catch (error) {
            res.status(500).json({ error: error.message }); // Código 500 Internal Server Error para erros no servidor
        }
    }

    getMarkets(req, res) {
        try {
            const markets = this.voteService.getMarkets();
            res.status(200).json(markets); // Código 200 OK para sucesso na obtenção dos mercados
        } catch (error) {
            res.status(500).json({ error: error.message }); // Código 500 Internal Server Error para erros no servidor
        }
    }
}

module.exports = VoteController;
