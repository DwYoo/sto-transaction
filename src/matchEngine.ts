import Queue from 'queue-fifo';
import { ISt, IOrder, ITrade } from './base';


interface IOneSideOrderBook {
    [key: number]: Queue<IOrder>;
}

interface IOrderBook {
    asks: IOneSideOrderBook;
    bids: IOneSideOrderBook;
}

class MatchEngine {
    st: ISt;
    price_tick: number;
    qty_tick: number;
    asks: IOneSideOrderBook;
    bids: IOneSideOrderBook;
    orders: IOrderBook;
    constructor(st:ISt) {
        this.st = st;
        this.price_tick = st.price_tick;
        this.qty_tick = st.qty_tick;
        // key: price, value: queue
        this.asks = {};
        this.bids = {};
        this.orders = {
            asks: this.asks,
            bids: this.bids
        };
      }

    handleNewOrder(order:IOrder) {
        if (order.side === 'buy') {
            this._handleNewBuyOrder(order);
        }
        if (order.side === 'sell') {
            this._handleNewSellOrder(order);
        }
    }
    
    _handleNewBuyOrder(order:IOrder) {
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

    _handleNewSellOrder(order:IOrder) {
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


    _matchWithBuyOrder(order:IOrder) {
        const tradePrice = order.price;
        const bidQueue = this.bids[tradePrice];
        const makerOrder = bidQueue.peek();
        if (makerOrder) {
            const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
            console.log("new trade:\n", tradePrice, tradeQty, Date.now(), makerOrder, order);
            //TODO: add trade to batch. 
            makerOrder.remaining_qty -= tradeQty;
            makerOrder.filled_qty += tradeQty;
            order.remaining_qty -= tradeQty;
            order.filled_qty += tradeQty;
            if (makerOrder.remaining_qty === 0) {
                makerOrder.status = 'filled';
                bidQueue.dequeue();
            }
        } else {
        throw new Error('Buy order queue is empty');
    }
    }

    _matchWithSellOrder(order:IOrder) {
        const tradePrice = order.price;
        const askQueue = this.asks[tradePrice];
        const makerOrder = askQueue.peek();
        if (makerOrder) {
            const tradeQty = Math.min(makerOrder.remaining_qty, order.remaining_qty);
            console.log("new trade:\n", tradePrice, tradeQty, Date.now(), makerOrder, order);
            //TODO: add trade to batch. 
            makerOrder.remaining_qty -= tradeQty;
            makerOrder.filled_qty += tradeQty;
            order.remaining_qty -= tradeQty;
            order.filled_qty += tradeQty;
            if (makerOrder.remaining_qty === 0) {
                makerOrder.status = 'filled';
                askQueue.dequeue();
            }
        } else {
        throw new Error('Sell order queue is empty');
        }
    }

    _addNewBuyOrder(order:IOrder) {
        const price = order.price;
        if (!(price in this.bids)) {
            this.bids[price] = new Queue();
        }
        this.bids[price].enqueue(order);
    }

    _addNewSellOrder(order:IOrder) {
        const price = order.price;
        if (!(price in this.asks)) {
            this.asks[price] = new Queue();
        }
        this.asks[price].enqueue(order);
    }

    _existsBuyMakerOrder(price:number) {
        if (!(price in this.bids)) {
            return false;
        }
        if (this.bids[price].size() === 0) {
            return false;
        } 
        return true;
    }
    
    _existsSellMakerOrder(price:number) {
        if (!(price in this.asks)) {
            return false;
        }
        if (this.asks[price].size() === 0) {
            return false;
        }
        return true;
    }

}

export { MatchEngine };