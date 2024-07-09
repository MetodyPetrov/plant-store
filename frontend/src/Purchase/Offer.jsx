import { useContext, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";
import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";

export default function Offer({ offer, searchQuery }) {
    const { addItemToCart } = useContext(CartContext);

    const inputQuantity = useRef(null);
    const [ viewDescription, setViewDescription ] = useState(false);
    
    const [ offerTitle, setOfferTitle] = useState(offer?.name);
    const [ offerPrice, setOfferPrice ] = useState(offer?.price);

    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    function handleAddProduct() {
        addItemToCart(offer, inputQuantity?.current?.value);
        if(!checkNavBarPageExist(<CartIcon className="cart-icon"/>)) changeNavBar({ mode: 'ADD', newKey: <CartIcon className="cart-icon"/>, newValue: '/cart' }); // TODO: make sure to add this only once and think about storing the selected items in some context, not sure if it should be the outlet one or no...
    }

    useEffect(() => {
        if(!searchQuery) {
            setOfferTitle(offer?.name);
            setOfferPrice(offer?.price);
            return;
        }
        const isnumber = !isNaN(searchQuery);
        let newTranscript = [];
        for (let i = 0; i < (isnumber ? offer.price.length : offer.name.length); i++) {
            let part = '';
            for (let j = 0; j < searchQuery.length && j + i < (isnumber ? offer.price.length : offer.name.length); j++) {
                part += (isnumber ? offer.price[j + i] : offer.name[j + i]);
            }
            if(part.toLowerCase() === searchQuery.toLowerCase()) {
                i += searchQuery.length - 1;
                newTranscript.push(<span className="highlighted" key={i}>{part}</span>);
            }
            else newTranscript.push((isnumber ? offer.price[i] : offer.name[i])); // TODO: outsource this into a function and maybe think about how to sort by type
        }
        isnumber ? setOfferPrice(newTranscript) : setOfferTitle(newTranscript);
    }, [searchQuery, offer.name, offer.price]);

    return (
        <div className="offer">
            <Link to={`/store/${offer?._id}`}><img src={offer?.url} alt={offer?.name} className="offer-img"></img></Link>
            <br/>
            <h1 className="offer-title" onClick={(e) => setViewDescription(e)}>{offerTitle || 'Unset Title'}</h1>

            { viewDescription && <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)}>{offer?.description || 'unset description'}</OfferDescription>}
            <div className="flex-filler"></div>
            <div className="offer-info">
                <h2 className="offer-price">{offerPrice || '0.00 lv'}</h2>
                <Quantity quantity={offer?.quantity || 0} inpRef={inputQuantity}/>
                <CartIcon onClick={handleAddProduct} className="add-cart-icon"/>
            </div>
        </div>
    );
}