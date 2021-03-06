import React from 'react';

export default class StockDetail extends React.Component {
    state = {
        qtyToBuy: 0
    }
    buyStock = () => {
        const {stock, userStocks, initiateBuy} = this.props;
        const currentHolding = userStocks.filter(stk => stk.stockName === stock.stockName)[0];
        let totalQty = this.state.qtyToBuy;
        let avgPrice = stock.cmp;
        if (currentHolding) {
            totalQty = totalQty + currentHolding.qty;
            avgPrice = ((currentHolding.avgPrice * currentHolding.qty) + (this.state.qtyToBuy * stock.cmp))/ totalQty;
        }
        avgPrice = Math.round(avgPrice);
        const payLoad = {
            qty: totalQty,
            avgPrice,
            stockName: stock.stockName,
            list : stock._id
        }
        initiateBuy(payLoad);
    }
    sellStock = () => {
        const {stock, userStocks, initiateSell} = this.props;
        const currentHolding = userStocks.filter(stk => stk.stockName === stock.stockName)[0];
        let totalQty = this.state.qtyToBuy;
        let avgPrice = stock.cmp;
        if (currentHolding) {
            totalQty = currentHolding.qty - totalQty;
            avgPrice = ((currentHolding.avgPrice * currentHolding.qty) + (this.state.qtyToBuy * stock.cmp))/ totalQty;
            avgPrice = Math.round(avgPrice);
            avgPrice = avgPrice < 1 ? 1 : avgPrice;
            const payLoad = {
                qty: totalQty,
                avgPrice,
                stockName: stock.stockName,
                list : stock._id
            }
            initiateSell(payLoad);
        }
        else  {
            return;
        }
    }
    isEligibleToBuy = () => {
        const {stock, user} = this.props;
        return this.state.qtyToBuy > 0 && user.worth >= this.state.qtyToBuy * stock.cmp;
    }
    isEligibleToSell = (e) => {
        const {stock, user, userStocks} = this.props;
        const currentHolding = userStocks.filter(stk => stk.stockName === stock.stockName)[0];
        return currentHolding && currentHolding.qty > 0;
    }

    handlyQtyChange = (e) => {
        this.setState({
            qtyToBuy:e.target.value
        });
    }
    render = () => {
        const {stock} = this.props;
        return (
            <div>
        <div>
            <h1>
                {stock.stockName}
            </h1>
            <h4>Available Qty: {stock.qtyAvailable}</h4>
            <h4>Current Price: {stock.cmp}</h4>
            <input placeholder="Enter quantity to trade" onChange={this.handlyQtyChange}></input>
            <div>
            <button disabled={!this.isEligibleToBuy()} onClick={this.buyStock}>Buy</button>
            <button disabled={!this.isEligibleToSell()} onClick={this.sellStock}>Sell</button> 
            </div>
        </div>
        </div>

        )
    }
}