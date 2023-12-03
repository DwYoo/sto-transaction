import {IOrder, ITrade, ISt} from '../src/base';
import { MatchEngine } from '../src/matchEngine';
import {OrderValidator} from '../src/orderValidator';

const order1: IOrder = {
  id:1, 
  user_id:1, 
  st_id: 1, 
  side: 'buy',
  price: 100, 
  qty: 10, 
  filled_qty:0, 
  remaining_qty: 10, 
  status:'new', 
  created_at: Date.now()
  }

const order2: IOrder = {
  id: 2,
  user_id: 2,
  st_id: 1,
  side: 'sell',
  price: 100,
  qty: 20,
  filled_qty: 0,
  remaining_qty: 20,
  status: 'new',
  created_at: Date.now()
};

const order3: IOrder = {
  id: 3,
  user_id: 3,
  st_id: 1,
  side: 'buy',
  price: 90,
  qty: 30,
  filled_qty: 0,
  remaining_qty: 30,
  status: 'new',
  created_at: Date.now()
};

const order4: IOrder = {
  id: 4,
  user_id: 4,
  st_id: 1,
  side: 'sell',
  price: 110,
  qty: 40,
  filled_qty: 0,
  remaining_qty: 40,
  status: 'new',
  created_at: Date.now()
};

const order5: IOrder = {
  id: 5,
  user_id: 4,
  st_id: 1,
  side: 'sell',
  price: 105,
  qty: 10,
  filled_qty: 0,
  remaining_qty: 10,
  status: 'new',
  created_at: Date.now()
};

const order6: IOrder = {
  id: 6,
  user_id: 4,
  st_id: 1,
  side: 'sell',
  price: 0,
  qty: -1,
  filled_qty: 0,
  remaining_qty: 15,
  status: 'new',
  created_at: Date.now()
};

const order7: IOrder = {
  id: 6,
  user_id: 4,
  st_id: 1,
  side: 'sell',
  price: 0,
  qty: 21,
  filled_qty: 0,
  remaining_qty: 15,
  status: 'new',
  created_at: Date.now()
};


const st: ISt = {
    id: 1,
    ticker: 'ad',
    channel_id: 1,
    total_supply: 1,
    issued_supply: 1,
    issued_pct: 10,
    mark_price: 10,
    price_tick: 10,
    qty_tick: 10,
}

const matchEngine:MatchEngine = new MatchEngine(st);
const orderValidator:OrderValidator = new OrderValidator(st)
console.log(orderValidator.validateOrder(order1));
console.log(orderValidator.validateOrder(order2));
console.log(orderValidator.validateOrder(order3));
console.log(orderValidator.validateOrder(order4));
console.log(orderValidator.validateOrder(order5));
console.log(orderValidator.validateOrder(order6));
console.log(orderValidator.validateOrder(order7));



matchEngine.handleNewOrder(order1);
matchEngine.handleNewOrder(order2);
matchEngine.handleNewOrder(order3);
matchEngine.handleNewOrder(order4);
console.log(matchEngine.bids['100'].peek());
console.log(matchEngine.asks['110'].peek());

