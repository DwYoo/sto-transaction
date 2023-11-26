const Queue = require('queue-fifo');
const {Order, Trade} = require('./base');


//key: price, value: queue
const buyOrderQueue = {};

//key: price, value: queue
const sellOrderQueue = {};

class matchEngine {
    constructor() {
        // key: price, value: queue
        this.buyOrderQueue = {};
        this.sellOrderQueue = {};
        this.orderQueues = {
            buy: this.buyOrderQueue,
            sell: this.sellOrderQueue
        };
      }
    
    handleNewOrder(order) {
        const side = order.side;
        const price = order.price;
        if 

    }

    _isTakeOrder(side, price) {
        return side === 'buy' ? price in this.sellOrderQueue : price in this.buyOrderQueue;
    }

    _existsBuyMakerOrder(price) {
        if (!price in this.buyOrderQueue) {
            return false;
        }
        if (this.buyOrderQueue[price].length === 0) {
            return false;
        } 
        return true;
    }
    

    _existsSellMakerOrder(price) {
        if (!price in this.sellOrderQueue) {
            return false;
        }
        if (this.sellOrderQueue[price].length === 0) {
            return false;
        }
        return true;
    }


    _isMakerOrder(side, price) {
        return side === 'buy' ? !(price in this.sellOrderQueue) : !(price in this.buyOrderQueue);
    }

    _handleNewPriceBuyOrder(price, order) {
        this.buyOrderQueue[price] = new Queue();
        this.buyOrderQueue[price].enqueue(order);
    }
    
    _handleNewPriceSellOrder(price, order) {
        this.sellOrderQueue[price] = new Queue();
        this.sellOrderQueue[price].enqueue(order);
    }   
}