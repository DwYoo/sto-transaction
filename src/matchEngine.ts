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
    totalAsks: number
    totalBids: number
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
        this.totalAsks = 0;
        this.totalBids = 0;
      }
    
    handleNewOrder(order:IOrder) {
        if (order.type === 'limit') {
            this._handleNewLimitOrder(order);
        }
        if (order.type === 'market') {
            this._handleNewMarketOrder(order);
        }
    }


    _handleNewLimitOrder(order:IOrder) {
        if (order.side === 'buy') {
            this._handleNewLimitBuyOrder(order);
        }
        if (order.side === 'sell') {
            this._handleNewLimitSellOrder(order);
        }
    }

    _handleNewMarketOrder(order:IOrder) {
        if (order.side === 'buy') {
            this._handleNewMarketBuyOrder(order);
        }
        if (order.side === 'sell') {
            this._handleNewMarketSellOrder(order);
        }
    }

    
    _handleNewLimitBuyOrder(order:IOrder) {
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

    _handleNewLimitSellOrder(order:IOrder) {
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

    _handleNewMarketBuyOrder(order: IOrder) {
        if ()
        while (true) {
            if (order.remaining_qty === 0) {
                order.status = 'filled';
                break;
            }
            if (Object.keys(this.asks).length > 0) {

            }
            else {
                throw new Error("")
            }
            
        }
    }
    
    _handleNewMarketSellOrder(order: IOrder) {
        while (true) {
            if (order.remaining_qty === 0) {
                order.status = 'filled';
                break;
            }
        }

    }

    _getBestBuyPrice(): number {
        const bidPrices = Object.keys(this.bids).map(Number).filter(price => this.bids[price].size() > 0).sort((a, b) => b - a);
        if (bidPrices.length === 0) {
            throw new Error('There is no bid order');
        }
        return bidPrices[0];
    }


    _getBestSellPrice(): number{
        const askPrices = Object.keys(this.asks).map(Number).filter(price => this.asks[price].size() > 0).sort((a, b) => a - b);
        if (askPrices.length === 0) {
            throw new Error('There is no ask order'); 
        }
        return askPrices[0];
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
                if (bidQueue.isEmpty()) {
                    this._removePrice(this.bids, tradePrice);
                }
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
                if (askQueue.isEmpty()) {
                    this._removePrice(this.asks, tradePrice);
                }
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
        this.t
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

    _removePrice(obj: IOneSideOrderBook, key: number): Object {
        const { [key]: deletedKey, ...rest } = obj;
        return rest;
    }
}



export { MatchEngine };