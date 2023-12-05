import { ISt, IOrder, ITrade } from './base';

class OrderValidator {
    st: ISt;
    constructor(st:ISt) {
        this.st = st;
    }

    validateOrder(order:IOrder) {
        //return true if valid, false with error if invalid
        try {
            this.validateStId(order.st_id);
            this.validateSide(order.side);
            this.validateQty(order.qty, this.st.qty_tick);
            this.validateType(order.type);
            if (order.type === 'limit') {
                this.validatePrice(order.price, this.st.price_tick);
            }
            this.validateOrderStatus(order.status);
            return [true, null];
        } catch (e) {
            return [false, e];
       }
    }


    validateUserBalanceBuyOrder(userFiatBalance:number, price:number, qty:number) {
        const totalCost = price * qty;
        if (userFiatBalance < totalCost) {
            throw new Error('Invalid order: insufficient fiat balance');
        }
    }

    validateUserBalanceSellOrder(userStBalance:number, qty:number) {
        if (userStBalance < qty) {
            throw new Error('Invalid order: insufficient st balance');
        }
    }

    validateStId(stId:number) {
        if (stId !== this.st.id) {
            throw new Error('Invalid order stId: ST ID mismatch');
        }
    }

    validateSide(side:string) {
        if (side !== 'buy' && side !== 'sell') {
            throw new Error('Invalid order side: side must be either buy or sell');
        }
    }

    validateType(type:string) {
        if (type !== 'limit' && type !== 'market') {
            throw new Error('Invalid order type: type must be either limit or market')
        }
    }

    validateQty(qty:number, qtyTick:number) {
        if (qty <= 0) {
            throw new Error('Invalid order qty: qty must be greater than 0');
        }
        if (qty % qtyTick !== 0) {
            throw new Error('Invalid order qty: check qty tick');
        }
    }
    
    validatePrice(price:number, priceTick:number) {
        if (price <= 0) {
            throw new Error('Invalid order price: price must be greater than 0');
        }
        if (price % priceTick !== 0) {
            throw new Error('Invalid order price: check price tick');
        }
    }

    validateOrderStatus(orderStatus:string) {
        if (orderStatus !== 'new') {
            throw new Error('Invalid order status: order status must be new');
        }
    }


}
export {OrderValidator}