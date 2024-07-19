import { useContext, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";
import CheckOutOffer from "./CheckOutOffer";
import ProgressDialog from "../Dialogs/ProgressDialog";
import { fetchCartCheckout } from "../utils/http";
import { useMutation } from '@tanstack/react-query';

export default function CartPage() {
    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: fetchCartCheckout,
        onSuccess: () => {
            clearCart();
        }
    });

    useEffect(() => {
        if(!checkNavBarPageExist(<CartIcon />)) navigate('/account');
    }, [checkNavBarPageExist, navigate]);
    useEffect(() => {
        if(!cart?.length) changeNavBar({ mode: 'DELETE', key: <CartIcon className="cart-icon" /> });
    }, [cart, changeNavBar]);

    async function handleCheckout() {
        if(!localStorage.getItem('accessToken')) navigate('/authenticate');
        mutate({ cart: cart });
    }

    return (
        <>
            { isPending && <ProgressDialog><h1>Processing Purchase...</h1></ProgressDialog> }
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