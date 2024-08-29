class VoteService {
    constructor(database) {
        this.database = database;
    }

    addVote(vote) {
        const db = this.database.read();
        const { clientId, marketId, hygiene, queues, service, prices, date } = vote;

        const numericMarketId = parseInt(marketId, 10);

        const market = db.markets.find(m => m.marketId === numericMarketId);

        if (!market) {
            throw new Error('Mercado não encontrado.');
        }

        const currentVoteDate = new Date(date);
        const currentWeekStart = new Date(currentVoteDate.setDate(currentVoteDate.getDate() - currentVoteDate.getDay()));

        if (db.votes.some(vote => {
            const voteDate = new Date(vote.date);
            const voteWeekStart = new Date(voteDate.setDate(voteDate.getDate() - voteDate.getDay()));
            return vote.clientId === clientId && voteWeekStart.toISOString().split('T')[0] === currentWeekStart.toISOString().split('T')[0];
        })) {
            throw new Error('Você só pode votar em um supermercado uma vez por semana.');
        }

        const newVoteId = db.votes.length ? Math.max(...db.votes.map(v => v.id)) + 1 : 1;
        const newVote = { ...vote, id: newVoteId };
        db.votes.push(newVote);

        const updatedMarket = {
            ...market,
            hygiene: market.hygiene + hygiene,
            queues: market.queues + queues,
            service: market.service + service,
            prices: market.prices + prices,
            totalVotes: market.totalVotes + 1,
        };
        const marketIndex = db.markets.findIndex(m => m.marketId === numericMarketId);
        db.markets[marketIndex] = updatedMarket;

        // Atualizar o cliente
        if (!db.clients.some(c => c.id === clientId)) {
            const newClient = { id: clientId, lastVoteDate: date };
            db.clients.push(newClient);
        } else {
            const client = db.clients.find(c => c.id === clientId);
            client.lastVoteDate = date;
        }

        this.database.write(db);
        return newVote;
    }

    getResults() {
        const db = this.database.read();
    
        const voteCounts = db.votes.reduce((acc, vote) => {
            acc[vote.marketId] = (acc[vote.marketId] || 0) + 1;
            return acc;
        }, {});
    
        const results = db.markets.map(market => ({
            marketId: market.marketId, 
            marketName: market.marketName, 
            totalVotes: voteCounts[market.marketId] || 0, 
            hygiene: market.hygiene,
            queues: market.queues,
            service: market.service,
            prices: market.prices,
            image: market.image 
        }));
    
        return results;
    }

    getLeadingMarket() {
        const db = this.database.read();
    
        if (!db || !db.votes || !db.markets) {
            throw new Error('Dados inválidos da base de dados.');
        }
    
        const voteCounts = db.votes.reduce((acc, vote) => {
            acc[vote.marketId] = (acc[vote.marketId] || 0) + 1;
            return acc;
        }, {});
    
        // Encontrar o número máximo de votos
        const maxVotes = Math.max(...Object.values(voteCounts));
    
        const leadingMarketIds = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
    
        const leadingMarkets = db.markets.filter(market => leadingMarketIds.includes(market.marketId.toString()));
    
        if (leadingMarkets.length > 0) {
            return leadingMarkets.map(market => ({
                marketId: market.marketId,
                marketName: market.marketName,
                totalVotes: voteCounts[market.marketId],
                image: market.image // Adicionando o campo image aos resultados
            }));
        } else {
            throw new Error('Nenhum mercado encontrado.');
        }
    }
    
    getMarkets() {
        const db = this.database.read();
        return db.markets;
    }

    generateClientId() {
        const db = this.database.read();
        const nextClientId = db.clients.length ? Math.max(...db.clients.map(c => c.id)) + 1 : 1;
        return nextClientId;
    }
}

module.exports = VoteService;
