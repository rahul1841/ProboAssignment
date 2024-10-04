const express = require('express');
const dotenv = require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const log = require('./utilities/Logger');
let { botActive, startBot, getBalance, getLastBuyPrice, getShares, getTotalProfit, getTotalLoss, getStockPrice } = require('./services/tradingBot');

// Ideally api's should be in mvc structure but less api are there so implement in index.js file

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', function(req, res) {
    res.send('Hello From Rahul');
    const API_KEY = process.env.API_KEY;
    log.Info(API_KEY);
});

// to start bot

app.post('/startBot', function(req, res) {
    if(!botActive) {
        log.Info('Bot started');
        // botActive = true;
        const Symbol = req.body.Symbol;
        startBot(Symbol);
        return res.json({ message: 'Trading bot started.' });
    }
    else {
        return res.status(400).send('Bot is already active');
    }
})


// to get summary
app.get('/summary', function(req, res) {
    return res.json({
        balance: getBalance(),
        lastBuyPrice: getLastBuyPrice(),
        shares: getShares(),
        totalProfit: getTotalProfit(),
        totalLoss: getTotalLoss(),
        stockPrice: getStockPrice()
    });
});


//  to get shares
app.get('/shares', function(req, res) {
    return res.json({ shares: getShares() });
});

// to get toal profit
app.get('/totalProfit', function(req, res) {
    return res.json({ totalProfit: getTotalProfit() });
});


// to get total loss
app.get('/totalLoss', function(req, res) {
    return res.json({ totalLoss: getTotalLoss() });
});


// to get stockPrice
app.get('/stockPrice', function(req, res) {
    return res.json({ stockPrice: getStockPrice() });
});

// to get currentBalance
app.get('/currentBalance', function(req, res) {
    return res.json({ balance: getBalance() });
});


// to get lastBuyPrice
app.get('/lastBuyPrice', function(req, res) {
    return res.json({ lastBuyPrice: getLastBuyPrice() });
});


// to get status of bot is active or not
app.get('/status', function(req, res) {
    if(botActive) {
        return res.json({ message: 'Bot is active' });
    }
    else {
        return res.json({ message: 'Bot is not active' });
    }
});


// to stop the bot
app.post('/stopBot', function(req, res) {
    if(botActive) {
        log.Info('Bot stopped');
        botActive = false;
        return res.json({ message: 'Trading bot stopped.' });
    }
    else {
        return res.status(400).send('Bot is not active');
    }
});



app.listen(port, function() {
    log.Info(`Server is running on port ${port}`);
});