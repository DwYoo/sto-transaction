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
    constructor(trade_id, st_id, trade_price, trade_qty, traded_at, maker_order_id, taker_order_id) {
      this.trade_id = trade_id;
      this.st_id = st_id;
      this.trade_price = trade_price;
      this.trade_qty = trade_qty;
      this.traded_at = traded_at;
      this.maker_order_id = maker_order_id;
      this.taker_order_id = taker_order_id;
    }
}

module.exports = {
    Order,
    Trade
}