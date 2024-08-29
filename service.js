const express = require('express');
const cors = require('cors'); // Importando o pacote cors
const routes = require('./src/routes/routes');

const app = express();

app.use(cors()); // Ativando o CORS
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});
