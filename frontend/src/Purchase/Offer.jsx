import { useContext, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";
import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";

export default function Offer({ offer }) {
    const { addItemToCart } = useContext(CartContext);

    const inputQuantity = useRef(null);
    const [ viewDescription, setViewDescription ] = useState(false);

    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    function handleAddProduct() {
        addItemToCart(offer, inputQuantity?.current?.value);
        if(!checkNavBarPageExist(<CartIcon className="cart-icon"/>)) changeNavBar({ mode: 'ADD', newKey: <CartIcon className="cart-icon"/>, newValue: '/cart' }); // TODO: make sure to add this only once and think about storing the selected items in some context, not sure if it should be the outlet one or no...
    }

    return (
        <div className="offer">
            <Link to={`/store/${offer?._id}`}><img src={offer?.url} alt={offer?.name} className="offer-img"></img></Link>
            <br/>
            <h1 className="offer-title" onClick={(e) => setViewDescription(e)}>{offer?.name || 'Unset Title'}</h1>

            { viewDescription && <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)}>{offer?.description || 'unset description'}</OfferDescription>}
            <div className="flex-filler"></div>
            <div className="offer-info">
                <h2 className="offer-price">{offer?.price || '0.00 lv'}</h2>
                <Quantity quantity={offer?.quantity || 0} inpRef={inputQuantity}/>
                <CartIcon onClick={handleAddProduct} className="add-cart-icon"/>
            </div>
        </div>
    );
}