const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, '../data/db.json');
    }

    read() {
        const data = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    write(data) {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    }
}

module.exports = Database;
