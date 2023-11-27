const Queue = require('queue-fifo');
const {Order, Trade} = require('./base');


class MatchEngine {
    constructor() {
        // key: price, value: queue
        this.buyOrders = {};
        this.sellOrders = {};
        this.orders = {
            buy: this.buyOrders,
            sell: this.sellOrders
        };
      }

    handleNewOrder(order) {
        if (order.side === 'buy') {
            this._handleNewBuyOrder(order);
        }
        if (order.side === 'sell') {
            this._handleNewSellOrder(order);
        }
    }
    
    _handleNewBuyOrder(order) {
        while (true) {
            if (order.remaining_qty <= 0) {
                order.status = 'filled';
                break;
            }
            if (this._existsSellMakerOrder(order.price)) {
                this._matchWithSellOrder(order);
            } else { // no matching order => add to buy queue
                this._addNewBuyOrder(order);
            }
        }
    }

    _handleNewSellOrder(order) {
        while (true) {
            if (order.remaining_qty <= 0) {
                order.status = 'filled';
                break;
            }
            if (this._existsBuyMakerOrder(order.price)) {
                this._matchWithBuyOrder(order);
            } else { // no matching order => add to sell queue
                this._addNewSellOrder(order);
            }
        }
    }


    _matchWithBuyOrder(order) {
        const tradePrice = order.price;
        const queue = this.buyOrders[tradePrice];
        const makerOrder = queue.peek();
        const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
        const trade = new Trade(null, null, tradePrice, tradeQty, Date.now(), makerOrder.id, order.id);
        console.log(trade);
        //TODO: add trade to batch. 
        makerOrder.remaining_qty -= tradeQty;
        makerOrder.filled_qty += tradeQty;
        order.remaining_qty -= tradeQty;
        order.filled_qty += tradeQty;
        if (makerOrder.remaining_qty <= 0) {
            makerOrder.status = 'filled';
            queue.dequeue();
        }
    }

    _matchWithSellOrder(order) {
        const tradePrice = order.price;
        const sellQueue = this.sellOrders[tradePrice];
        const makerOrder = sellQueue.peek();
        const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
        const trade = new Trade(null, null, tradePrice, tradeQty, Date.now(), makerOrder.id, order.id);
        console.log(trade);
        //TODO: add trade to batch. 
        makerOrder.remaining_qty -= tradeQty;
        makerOrder.filled_qty += tradeQty;
        order.remaining_qty -= tradeQty;
        order.filled_qty += tradeQty;
        if (makerOrder.remaining_qty <= 0) {
            makerOrder.status = 'filled';
            sellQueue.dequeue();
        }
    }


    _addNewBuyOrder(order) {
        const price = order.price;
        if (!price in this.buyOrders) {
            this.buyOrders[price] = new Queue();
        }
        this.buyOrders[price].enqueue(order);
    }

    _addNewSellOrder(order) {
        const price = order.price;
        if (!price in this.sellOrders) {
            this.sellOrders[price] = new Queue();
        }
        this.sellOrders[price].enqueue(order);
    }

    _existsBuyMakerOrder(price) {
        if (!price in this.buyOrders) {
            return false;
        }
        if (this.buyOrders[price].length === 0) {
            return false;
        } 
        return true;
    }
    
    _existsSellMakerOrder(price) {
        if (!price in this.sellOrders) {
            return false;
        }
        if (this.sellOrders[price].length === 0) {
            return false;
        }
        return true;
    }

}

module.exports = MatchEngine;