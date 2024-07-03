import { useContext, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";
import CheckOutOffer from "./CheckOutOffer";
import { fetchCartCheckout } from "../utils/http";

export default function CartPage() {
    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!checkNavBarPageExist(<CartIcon />)) navigate('/home');
    }, [checkNavBarPageExist, navigate]);
    useEffect(() => {
        if(!cart?.length) changeNavBar({ mode: 'DELETE', key: <CartIcon className="cart-icon" /> });
    }, [cart, changeNavBar]);

    async function handleCheckout() {
        await fetchCartCheckout(cart);
    }

    return (
        <>
            <div className="page-bg cartpage-bg"></div>
            <div className="cart-container-wrapper">
                <div className="cart-container">
                    <div className="upper-left-corner corner"></div>
                    <div className="upper-right-corner corner"></div>
                    <div className="down-left-corner corner"></div>
                    <div className="down-right-corner corner"></div>

                    {cart.map((product, index) => (
                        <CheckOutOffer key={index} offer={product}/>
                    ))}

                    <div className="flex-filler"></div>
                    <div className="checkout-button-wrapper">
                        <button className="checkout-button color-changing-button" onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            </div>
        </>
    );
}