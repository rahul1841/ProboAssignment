# Trading Bot Application

## Overview
This project is a trading bot application that implements a mean reversion trading strategy. The bot fetches market data from the Finnhub API to execute buy and sell decisions based on stock price fluctuations.

## Requirements
- Node.js 
- NPM 

## Getting Started

## How to run

### 1. Obtain an API Key
First obtain API Key from Finhub:
1. Go to the [Finnhub Dashboard](https://finnhub.io/dashboard).
2. Log in to your account.
3. Generate your API key from the dashboard.

### 2. Install Dependencies
After cloning the repository, navigate to the project directory and install the necessary dependencies:

 ```bash```
npm install
node index.js  or npm start. server will start at (http://localhost:5000/)

### 3. Commands to test Api's

### 3.1 Start the Bot
Starts the trading bot with the specified stock symbol: 
- curl -X POST http://localhost:5000/startBot -H "Content-Type: application/json" -d '{"Symbol": "AAPL"}'

### 3.2 Start the Bot
Stops the trading bot if it is currently active : 
- curl -X POST http://localhost:5000/stopBot

### 3.3 Check Bot Status
Checks whether the trading bot is currently active or not : 
- curl http://localhost:5000/status

### 3.4 Get Current Balance
Returns the current balance of the bot.
- curl http://localhost:5000/currentBalance

### 3.5 Get Last Buy Price
Fetches the price at which the last stock purchase was made : 
- curl http://localhost:5000/lastBuyPrice

### 3.6 Get Number of Shares
Returns the number of shares the bot currently owns : 
- curl http://localhost:5000/shares

### 3.7 Get Total Profit
Fetches the total profit made by the bot so far : 
- curl http://localhost:5000/totalProfit

### 3.8 Get Total Loss
Fetches the total loss incurred by the bot so far : 
- curl http://localhost:5000/totalLoss

### 3.9 Get Current Stock Price
Returns the current stock price being monitored by the bot : 
- curl http://localhost:5000/stockPrice

### 3.10 Get Trading Summary
Fetches a summary report that includes :
- curl http://localhost:5000/summary

### 3.10 Basic Health Check
To test if the server is running properly, you can hit the root endpoint :
- curl http://localhost:5000/


### 4. Note: 
- There will be no logs visible in the terminal and will only be visivle in the logs folder when you run the project.

### 5. API Key Note
- **Important**: The API key should be changed after a certain number of uses as it is not free. Please monitor your usage to avoid unexpected charges.
- The source does not update frequently for getting real-time updates, so ensure to check for market changes and adjust your strategy accordingly.


