import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";
import CartIcon from "../childComponents/CartIcon";
import { CartContext } from "./CartContext";

import AdminOptions from "../admin/AdminOptions";
import EditOffer from "../admin/EditOffer";
import Modal from "../Dialogs/Modal";

export default function Offer({ offer, searchQuery, displayType = false, adminOptions = true, ...props }) {
    const { addItemToCart } = useContext(CartContext);
    const offerRef = useRef(null);

    const inputQuantity = useRef(null);
    const [ viewDescription, setViewDescription ] = useState(false);
    const [ viewAdminOptions, setViewAdminOptions ] = useState(false);

    const [ offerEdit, setOfferEdit] = useState(false);
    
    const [ offerTitle, setOfferTitle] = useState(offer?.name);
    const [ offerPrice, setOfferPrice ] = useState(offer?.price);
    const [ offerType, setOfferType ] = useState(offer?.type);

    useEffect(() => {
        setOfferTitle(offer?.name);
        setOfferPrice(offer?.price);
        setOfferType(offer?.type);
    }, [offer]);

    const { changeNavBar, checkNavBarPageExist } = useOutletContext();
    function handleAddProduct() {
        addItemToCart(offer, inputQuantity?.current?.value);
        if(!checkNavBarPageExist(<CartIcon className="cart-icon"/>)) changeNavBar({ mode: 'ADD', newKey: <CartIcon className="cart-icon"/>, newValue: '/cart' });
    }

    function handleRightClick(e) {
        if(localStorage.getItem('client') !== 'admin') return;
        e.preventDefault();
        setViewAdminOptions(<AdminOptions offerId={offer._id} unmount={() => setViewAdminOptions(false)} pos={e}/>); 
    }

    useEffect(() => {
        function highlightSearch(searchString, attribute, stateChange) { 
            let newTranscript = [];
            for (let i = 0; i < attribute.length; i++) {
                let part = '';
                for (let j = 0; j < searchString.length && j + i < attribute.length; j++) {
                    part += attribute[j + i];
                }
                if(part.toLowerCase().includes(searchString.toLowerCase())) {
                    newTranscript.push(<span className="highlighted" key={i}>{part}</span>);
                    i += searchString.length - 1;
                }
                else newTranscript.push(attribute[i]);
            }
            stateChange(newTranscript);
        }
        
        if(searchQuery?.type) {
            const typeChange = (newType) => {
                setOfferType((oldType) => {
                    const finalType = [];
                    for(let i = 0; i < offer?.type.length; i++) {
                        const highlight = React.isValidElement(newType[i]) ? newType[i] : (React.isValidElement(oldType[i]) && oldType[i]);
                        finalType.push(highlight || offer?.type[i]);
                        i += highlight ? highlight.props.children.length - 1 : 0;
                    }
                    return finalType;
                }); 
            } // when something's written after ',' a newType is being defined, oldType is still taken into account and so if there's any highlights in either of them, they're kept

            const typeArray = searchQuery.type.split(',').map(type => type.trim());
            typeArray.forEach(type => type && highlightSearch(type, offer?.type, typeChange));
        }
        searchQuery?.name && highlightSearch(searchQuery.name, offer?.name, setOfferTitle);
        searchQuery?.price && highlightSearch(searchQuery.price, offer?.price, setOfferPrice);
        
        return () => {
            setOfferTitle(offer?.name);
            setOfferPrice(offer?.price);
            setOfferType(offer?.type);
        };
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, offer.name, offer.price, offer.type]);

    return (
        <>
            { viewAdminOptions }
            { viewDescription && <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)}>{offer?.description || 'unset description'}</OfferDescription>}
            <div className="offer" ref={offerRef} {...props}>

                { localStorage.getItem('client') === 'admin' && <svg onClick={() => setOfferEdit(true)} className="edit-offer-button" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg> }
                { 
                    offerEdit && 
                    <Modal unmount={() => setOfferEdit(false)}>
                        <EditOffer offer={offer}/>
                    </Modal> 
                }

                <Link to={offer?._id}><img src={offer?.url} alt={offer?.name} className="offer-img" onContextMenu={adminOptions ? handleRightClick : undefined}></img></Link>
                <br/>
                <h1 className="offer-title" onClick={(e) => setViewDescription(e)}>{offerTitle || 'Unset Title'}</h1>

                <div className="flex-filler"></div>
                { displayType && <p className="offer-type">Type: {offerType}</p> }
                <div className="offer-info">
                    <h2 className="offer-price">{offerPrice || '0.00 lv'}</h2>
                    <Quantity quantity={offer?.quantity || 0} inpRef={inputQuantity}/>
                    <CartIcon onClick={handleAddProduct} className="add-cart-icon"/>
                </div>
            </div>
        </>
    );
}