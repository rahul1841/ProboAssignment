const dotenv = require('dotenv').config({  path: './.env' });
const finnhub = require('finnhub');
const log = require('../utilities/Logger');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

/**
 * Initial balance
 */
let balance = 10000;
/**
 * Number of shares owned
 */
let shares = 0;
/**
 * Current stock price
 */     
let stockPrice = 0;  

/**
 * Commission fee for buying/selling shares
 */
const commissionFee = 5;

/**
 * Total Profit
 */
let totalProfit = 0;  
/**
 * Total Loss
 */
let totalLoss = 0;   
/**
 * Last buy price
 */
let lastBuyPrice = 0; 

/**
 * Quote
 * @typedef {Object} Quote
 * @property {number} o - Opening price
 * @property {number} h - High price of the day
 * @property {number} l - Low price of the day
 * @property {number} c - Current price (close for the current interval)
 * @property {number} pc - Previous close price
 * @property {number} d - Difference from previous close
 * @property {number} dp - Percentage change from previous close
 */
const Quote = {
    o: 225.14, 
    h: 226.805, 
    l: 223.32, 
    c: 223.675,
    pc: 226.78, 
    d: -3.105,  
    dp: -1.3692 
}; // initial assumed quote to for the bot to start trading

/**
 * check if the bot is active
 */
let botActive = false;

/**
 * Starts the trading bot
 * @param {string} name of the company
 */
function startBot(Symbol) {
    if(!botActive) {
        botActive = true; 
        log.Info(process.env.API_KEY);
        setInterval(() => {
            finnhubClient.quote('AAPL', (error, data, response) => {
                
                if (error) {
                    log.Info(error);
                }
                else meanReversionStrategy(data);
                log.Info(data);
                console.log(response);
            });
        }, 5000);
    }
    // fetches the data from the api for every 1 seconds
    // web sockets are generall used for real time data but sad I dont know web sockets 
    else {
        log.Info('Bot is already active');
    }
}

/**
 * 
 * @param {Quote} quote 
 */
function meanReversionStrategy(quote) {
    const { c, pc } = quote;  // Extract current price and previous close

    // Buy Condition: Stock is 2% below the previous close
    if (c < pc * 0.98) {
        buyStock(c, quote);
    }
    // Sell Condition: Stock is 2% above the previous close
    else if (c > pc * 1.02) {
        sellStock(c);
    }
}

/**
 * Buy the stock
 * @param {number} price 
 * @param {Quote} quote
 */
function buyStock(currentPrice, quote) {
    if (balance > commissionFee) {
        let maxAffordableShares = Math.floor((balance - commissionFee) / currentPrice);
        if (maxAffordableShares > 0) {
            shares += maxAffordableShares;
            lastBuyPrice = currentPrice; // Record the price at which shares were bought
            balance -= (maxAffordableShares * currentPrice + commissionFee);
            stockPrice = currentPrice;
            log.Info(`Bought ${maxAffordableShares} shares at $${currentPrice.toFixed(2)} per share. New balance: $${balance.toFixed(2)}`);
            Quote = quote; // change the quote if the stock is bought
        } else {
            log.Info("Not enough balance to buy shares.");
        }
    } else {
        log.Info("Insufficient funds to buy shares.");
    }
}

/**
 * Sell the stock
 * @param {number} price 
 */
function sellStock(currentPrice) {
    if (shares > 0) {
        const profitOrLoss = (currentPrice - lastBuyPrice) * shares; // Calculate profit/loss for this transaction
        balance += (shares * currentPrice - commissionFee);
        
        // Update total profit and loss
        if (profitOrLoss > 0) {
            totalProfit += profitOrLoss; // Add to total profit if it's a profit
            log.Info(`Sold ${shares} shares at $${currentPrice.toFixed(2)} per share. Profit: $${profitOrLoss.toFixed(2)}. New balance: $${balance.toFixed(2)}`);
        } else {
            totalLoss += -profitOrLoss; // Add to total loss if it's a loss
            log.Info(`Sold ${shares} shares at $${currentPrice.toFixed(2)} per share. Loss: $${-profitOrLoss.toFixed(2)}. New balance: $${balance.toFixed(2)}`);
        }
        
        shares = 0;  // Reset shares to 0 after selling everything
        stockPrice = currentPrice;
    } else {
        log.Info("No shares to sell.");
    }
}

/**
 * Get the current balance
 */
function getBalance() {
    return balance;
}

/**
 * Get the number of shares owned
 */
function getShares() {
    return shares;
}

/**
 * Get the total profit
 */
function getTotalProfit() {
    return totalProfit;
}

/**
 * Get the total loss
 */ 
function getTotalLoss() {
    return totalLoss;
}

/**
 * Get the last buy price
 */
function getLastBuyPrice() {
    return lastBuyPrice;
}

/**
 * Get the current stock price
 */
function getStockPrice() {
    return stockPrice;
}

/**
 * Close the bot
 */
function closeBot() {
    botActive = false;
}

module.exports = {
    botActive,
    startBot,
    getBalance,
    getShares,
    getTotalProfit,
    getTotalLoss,
    getLastBuyPrice,
    getStockPrice,
    closeBot
};