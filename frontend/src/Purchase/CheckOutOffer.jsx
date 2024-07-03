import { useContext, useState } from "react";
import Modal from "../Dialogs/Modal";
import { CartContext } from "./CartContext";

export default function CheckOutOffer({ offer }) {
    const [ imgFullView, setImgFullView ] = useState(false);
    const { addItemToCart, removeItemFromCart } = useContext(CartContext);

    return (
        <div className="checkout-offer">
            <img src={offer?.url} className="checkout-offer-img" onClick={() => setImgFullView(true)}></img>
            { imgFullView && <Modal unmount={() => setImgFullView(false)} loading={false}><img src={offer?.url}></img></Modal> }
            <h1>{offer?.name}</h1>
            <div className="checkout-offer-info">
                <div>
                    <h2>Quantity: <span>{offer?.buyQuantity}</span> item/s</h2>
                    <div className="buy-quantity-container">
                        <button className="minus-button" onClick={() => removeItemFromCart(offer, 1)}>-</button>
                        <button className="plus-button" onClick={() => addItemToCart(offer, 1)}>+</button>
                    </div>
                    <span className="max-buy-quantity">(max {offer?.quantity})</span>
                </div>
                <h2>Full Price: <span>{(offer?.buyQuantity * parseFloat(offer.price, 10)).toFixed(2)}</span> leva</h2>
                <h2>Plant Type: <span>{offer?.type}</span></h2>
            </div>
        </div>
    );
}