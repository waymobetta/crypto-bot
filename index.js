const request = require('request');
const figlet = require('figlet');
const chalk = require('chalk');
const clear = require('clear');
const Gdax = require('gdax');
const fs = require('fs');
const _ = require('lodash');
const program = require('commander');

clear();

// title

console.log(
	chalk.white(
		figlet.textSync(
		'\nCrypto-bot\n', {horizontalLayout: 'full'}
		)
	)
);

// commander CLI

program
	.version('0.0.1')
	.description('Description: Simple CLI for programmatic buying on GDAX')
	.option('-i, --id [number]', 'Get Account ID')
	.option('-l, --logs', 'Get account raw logs [history/ledger]')
	.option('-b, --buy [price] [units]', 'BUY: Buy crypto [price] [units]')
	.option('-s, --sell [price] [units]', 'SELL: Sell crypto [price] [units]')
	.option('-d, --destroy', 'DESTROY: Cancel all orders')
program.parse(process.argv);

// create api [private]
// config link: https://www.gdax.com/settings/api
// FILL IN

let key = '';
let b64secret = '';
let passphrase = '';
let apiURI = 'https://api.gdax.com';
let sandboxURI = 'https://api-public.sandbox.gdax.com';

// account IDs
// FILL IN

let eth_id = '';
let usd_id = '';
let btc_id = '';

// define callback specific to command

let callback = function(err, response, data) {
	if (program.logs) {
		console.log(data);
	} else if (program.sell) {
		console.log(data);
	} else if (program.buy) {
		console.log(data);
	} else if (program.destroy) {
		console.log(data);
	} else if (program.id === 3) {
		let accountID = data[3]['id'];
		console.log(`ETH ID: ${accountID}`);
	} else if (program.id === 2) {
		let accountID = data[2]['id'];
		console.log(`USD ID: ${accountID}`);
	} else if (program.id === 1) {
		let accountID = data[1]['id'];
		console.log(`BTC ID: ${accountID}`);
	} else if (err) { 		// need fix
		console.error(err);
	} else {
		console.log(data);
	}
}


// private api

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

// logic
// need additional logic to quickly switch between accounts

if (program.logs) {
	authedClient.getAccountHistory(eth_id, callback);
} else if (program.buy) {
	let buyParams = {
		'price': process.argv[3],
		'size': process.argv[4],
		'product_id': 'ETH-USD'
	};
	authedClient.buy(buyParams, callback)
} else if (program.sell) {
	let sellParams = {
		'price': process.argv[3],
		'size': process.argv[4],
		'product_id': 'ETH-USD'
	};
	authedClient.sell(sellParams, callback);
} else if (program.destroy) {
	authedClient.cancelAllOrders({product_id: 'ETH-USD'}, callback);
} else if (program.id) {
	authedClient.getAccounts(callback);
} else {
	console.log('Awaiting instructions..')
}

