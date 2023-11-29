const Queue = require('queue-fifo');
const {ST, Order, Trade} = require('./base');


class MatchEngine {
    constructor(st) {
        this.st = st;
        this.price_tick = st.price_tick;
        this.qty_tick = st.qty_tick;
        // key: price, value: queue
        this.asks = {};
        this.bids = {};
        this.orders = {
            asks: this.asks,
            bisd: this.bids
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
            if (order.remaining_qty === 0) {
                order.status = 'filled';
                break;
            }
            if (this._existsSellMakerOrder(order.price)) {
                this._matchWithSellOrder(order);
            } else { // no matching order => add to buy queue
                this._addNewBuyOrder(order);
                break;
            }
        }
    }

    _handleNewSellOrder(order) {
        while (true) {
            if (order.remaining_qty === 0) {
                order.status = 'filled';
                break;
            }
            if (this._existsBuyMakerOrder(order.price)) {
                this._matchWithBuyOrder(order);
            } else { // no matching order => add to sell queue
                this._addNewSellOrder(order);
                break;
            }
        }
    }


    _matchWithBuyOrder(order) {
        const tradePrice = order.price;
        const bidQueue = this.bids[tradePrice];
        const makerOrder = bidQueue.peek();
        const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
        const trade = new Trade(null, null, tradePrice, tradeQty, Date.now(), makerOrder, order);
        console.log(trade);
        //TODO: add trade to batch. 
        makerOrder.remaining_qty -= tradeQty;
        makerOrder.filled_qty += tradeQty;
        order.remaining_qty -= tradeQty;
        order.filled_qty += tradeQty;
        if (makerOrder.remaining_qty === 0) {
            makerOrder.status = 'filled';
            bidQueue.dequeue();
        }
    }

    _matchWithSellOrder(order) {
        const tradePrice = order.price;
        const askQueue = this.asks[tradePrice];
        const makerOrder = askQueue.peek();
        const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
        const trade = new Trade(null, null, tradePrice, tradeQty, Date.now(), makerOrder, order);
        console.log(trade);
        //TODO: add trade to batch. 
        makerOrder.remaining_qty -= tradeQty;
        makerOrder.filled_qty += tradeQty;
        order.remaining_qty -= tradeQty;
        order.filled_qty += tradeQty;
        if (makerOrder.remaining_qty === 0) {
            makerOrder.status = 'filled';
            bidQueue.dequeue();
        }
    }


    _addNewBuyOrder(order) {
        const price = order.price;
        if (!(price in this.asks)) {
            this.asks[price] = new Queue();
        }
        this.asks[price].enqueue(order);
    }

    _addNewSellOrder(order) {
        const price = order.price;
        if (!(price in this.bids)) {
            this.bids[price] = new Queue();
        }
        this.bids[price].enqueue(order);
    }

    _existsBuyMakerOrder(price) {
        if (!(price in this.asks)) {
            return false;
        }
        if (this.asks[price].size === 0) {
            return false;
        } 
        return true;
    }
    
    _existsSellMakerOrder(price) {
        if (!(price in this.bids)) {
            return false;
        }
        if (this.bids[price].size === 0) {
            return false;
        }
        return true;
    }

}

module.exports = MatchEngine;