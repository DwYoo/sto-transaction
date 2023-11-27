const {Order, Trade} = require('./src/base')
const MatchEngine = require('./src/matchEngine')
const Queue = require('queue-fifo');


const order1 = new Order(1, 1, 1, 'buy', 100, 10, 0, 10, 'new', Date.now(), null, null);
const order2 = new Order(2, 2, 1, 'sell', 100, 10, 0, 10, 'new', Date.now(), null, null);

const matchEngine = new MatchEngine();
matchEngine.handleNewOrder(order1);
matchEngine.handleNewOrder(order2);