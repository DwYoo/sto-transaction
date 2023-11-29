PRICE_SCALE = 1000;

class ST {
  constructor(id, ticker, channel_id, total_supply, issued_supply, issued_pct, mark_price, price_tick, qty_tick ) {
    this.id = id;
    this.ticker = ticker;
    this.channel_id = channel_id;
    this.total_supply = total_supply;
    this.issued_supply = issued_supply;
    this.issued_pct = issued_pct;
    this.mark_price = mark_price;
    this.price_tick = price_tick;
    this.qty_tick = qty_tick;
  }
}

class Order {
    constructor(id, user_id, st_id, side, price, qty, filled_qty, remaining_qty, status, created_at, updated_at, deleted_at) {
      this.id = id;
      this.user_id = user_id;
      this.st_id = st_id;
      this.side = side;
      this.price = price;
      this.qty = qty; //qty is scaled by 10^6. e.g. 1.2345 => 1234500
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
  constructor(st_id, trade_id, price, qty, from_address, to_address, created_at) {
    this.trade_id = trade_id;
    this.st_id = st_id;
    this.price = price;
    this.qty = qty;
    this.from_address = from_address;
    this.to_address = to_address;
    this.created_at = created_at;
  }

  static fromTrade(trade) {
    if (trade.is_buyer_maker){
      from_address = trade.maker_order.user_id;
      to_address = trade.taker_order.user_id;
    }
    else{
      from_address = trade.taker_order.user_id;
      to_address = trade.maker_order.user_id;
    }
    return new Transaction(trade.st_id, trade.id, trade.price, trade.qty, from_address, to_address, trade.traded_at);
  }
    
}

module.exports = {
    ST,
    Order,
    Trade,
    Transaction
}