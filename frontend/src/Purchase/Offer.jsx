import { useContext, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";
import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";
import AdminOptions from "../admin/AdminOptions";

export default function Offer({ offer, searchQuery, displayType = false, refetchOffers }) {
    const { addItemToCart } = useContext(CartContext);

    const inputQuantity = useRef(null);
    const [ viewDescription, setViewDescription ] = useState(false);
    const [ viewAdminOptions, setViewAdminOptions ] = useState(false);
    
    const [ offerTitle, setOfferTitle] = useState(offer?.name);
    const [ offerPrice, setOfferPrice ] = useState(offer?.price);
    const [ offerType, setOfferType ] = useState(offer?.type);

    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    function handleAddProduct() {
        addItemToCart(offer, inputQuantity?.current?.value);
        if(!checkNavBarPageExist(<CartIcon className="cart-icon"/>)) changeNavBar({ mode: 'ADD', newKey: <CartIcon className="cart-icon"/>, newValue: '/cart' }); // TODO: make sure to add this only once and think about storing the selected items in some context, not sure if it should be the outlet one or no...
    }

    function handleRightClick(e) {
        if(localStorage.getItem('client') !== 'admin') return;
        e.preventDefault();
        setViewAdminOptions(<AdminOptions offerId={offer._id} unmount={() => setViewAdminOptions(false)} pos={e} refetchOffers={refetchOffers}/>); // make this into a separate component and add a + and - that sent req for increasing the value of a product
    }

    useEffect(() => {
        function highlightSearch(attribute, stateChange) { 
            let newTranscript = [];
            for (let i = 0; i < attribute.length; i++) {
                let part = '';
                for (let j = 0; j < searchQuery.length && j + i < attribute.length; j++) {
                    part += attribute[j + i];
                }
                if(part.toLowerCase() === searchQuery.toLowerCase()) {
                    i += searchQuery.length - 1;
                    newTranscript.push(<span className="highlighted" key={i}>{part}</span>);
                }
                else newTranscript.push(attribute[i]);
            }
            stateChange(newTranscript);
        }

        if(!searchQuery) {
            setOfferTitle(offer?.name);
            setOfferPrice(offer?.price);
            setOfferType(offer?.type);
            return;
        }

        if(displayType) highlightSearch(offer?.type, setOfferType);
        else if(isNaN(searchQuery)) highlightSearch(offer?.name, setOfferTitle);
        else highlightSearch(offer?.price, setOfferPrice);
        
    }, [searchQuery, offer.name, offer.price]);

    return (
        <div className="offer">
            { viewAdminOptions }
            <Link to={`/store/${offer?._id}`}><img src={offer?.url} alt={offer?.name} className="offer-img" onContextMenu={handleRightClick}></img></Link>
            <br/>
            <h1 className="offer-title" onClick={(e) => setViewDescription(e)}>{offerTitle || 'Unset Title'}</h1>

            { viewDescription && <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)}>{offer?.description || 'unset description'}</OfferDescription>}
            <div className="flex-filler"></div>
            { displayType && <p className="offer-type">Type: {offerType}</p> }
            <div className="offer-info">
                <h2 className="offer-price">{offerPrice || '0.00 lv'}</h2>
                <Quantity quantity={offer?.quantity || 0} inpRef={inputQuantity}/>
                <CartIcon onClick={handleAddProduct} className="add-cart-icon"/>
            </div>
        </div>
    );
}