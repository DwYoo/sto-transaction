class Order {
    constructor(id, user_id, st_id, side, price, qty, filled_qty, remaining_qty, status, created_at, updated_at, deleted_at) {
      this.id = id;
      this.user_id = user_id;
      this.st_id = st_id;
      this.side = side;
      this.price = price;
      this.qty = qty;
      this.filled_qty = filled_qty;
      this.remaining_qty = remaining_qty;
      this.status = status; // new, filled, cancelled
      this.created_at = created_at;
      this.updated_at = updated_at;
      this.deleted_at = deleted_at;
    }
  }

class Trade {
  constructor(id, st_id, price, qty, traded_at, maker_order, taker_order) {
    this.id = id;
    this.st_id = st_id;
    this.price = price;
    this.qty = qty;
    this.traded_at = traded_at;
    this.maker_order = maker_order;
    this.taker_order = taker_order;
    this.is_buyer_maker = this.maker_order.side === 'buy';
  }
}

class Transaction {
  constructor(st_id, trade_id, price, qty, from_account, to_account, created_at) {
    this.trade_id = trade_id;
    this.st_id = st_id;
    this.price = price;
    this.qty = qty;
    this.from_account = from_account;
    this.to_account = to_account;
    this.created_at = created_at;
  }

  static fromTrade(trade) {
    if (trade.is_buyer_maker){
      from_account = trade.maker_order.user_id;
      to_account = trade.taker_order.user_id;
    }
    else{
      from_account = trade.taker_order.user_id;
      to_account = trade.maker_order.user_id;
    }
    to_account = trade.taker_order_id;
    return new Transaction(trade.st_id, trade.id, trade.price, trade.qty, from_account, to_account, trade.traded_at);
  }
    
}

module.exports = {
    Order,
    Trade
}