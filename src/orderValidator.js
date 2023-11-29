const {ST, Order, Trade} = require('./base');


class OrderValidator {
    constructor(st) {
        this.st = st;
    }

    static validateOrder(order) {
        //return true if valid, false with error if invalid
        try {
            OrderValidator.validateStId(order.st_id);
            OrderValidator.validateSide(order.side);
            OrderValidator.validateQty(order.qty, this.st.qty_tick);
            OrderValidator.validatePrice(order.price, this.st.price_tick);
            OrderValidator.validateOrderStatus(order.status);
            return [true, null];
        } catch (e) {
            return [false, e];
       }
    }

    
    static validateUserBalance(userBalance, order) {
        //return true if valid, false with error if invalid
        
    }

    static validateUserBalanceBuyOrder(userFiatBalance, price, qty) {
        const totalCost = price * qty;
        if (userFiatBalance < totalCost) {
            throw new Error('Invalid order: insufficient fiat balance');
        }
    }

    static validateUserBalanceSellOrder(userStBalance, qty) {
        if (userStBalance < qty) {
            throw new Error('Invalid order: insufficient st balance');
        }
    }

    static validateStId(stId) {
        if (stId !== this.st.id) {
            throw new Error('Invalid order stId: ST ID mismatch');
        }
    }

    static validateSide(side) {
        if (side !== 'buy' && side !== 'sell') {
            throw new Error('Invalid order side: side must be either buy or sell');
        }
    }

    static validateQty(qty, qtyTick) {
        if (qty <= 0) {
            throw new Error('Invalid order qty: qty must be greater than 0');
        }
        qtyTick = qtyTick * (10 ** 6);
        if (qty % qtyTick !== 0) {
            throw new Error('Invalid order qty: check qty tick');
        }
    }
    
    static validatePrice(price, priceTick) {
        if (price <= 0) {
            throw new Error('Invalid order price: price must be greater than 0');
        }
        price = price * (10 ** 6);
        priceTick = priceTick * (10 ** 6);
        if (price % priceTick !== 0) {
            throw new Error('Invalid order price: check price tick');
        }
    }

    static validateOrderStatus(orderStatus) {
        if (orderStatus !== 'new') {
            throw new Error('Invalid order status: order status must be new');
        }
    }


}