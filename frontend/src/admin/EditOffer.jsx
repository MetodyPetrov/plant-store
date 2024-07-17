import { useRef, useState } from "react";
import { fetchAddOffer, fetchEditOffer } from "../utils/http";
import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";

export default function EditOffer({ offer, reloadOffers }) {
    const offerRef = useRef(null);

    const [ viewDescription, setViewDescription ] = useState(false);

    const maxQuantity = useRef(null);
    const [ title, setTitle ] = useState(false);
    const [ description, setDescription ] = useState(false);
    const [ type, setType ] = useState(false);
    const [ price, setPrice ] = useState(false);
    const [ imgUrl, setImgUrl ] = useState(offer?.url || 'https://cdn.pixabay.com/photo/2013/07/12/17/20/leaf-152047_1280.png');

    function handleShowDescription(e) {
        e.clientX = e.clientX - window.innerWidth / 2 + offerRef.current.offsetWidth / 2 + 8;
        e.clientY = e.clientY - window.innerHeight / 2 + offerRef.current.offsetHeight / 2 + 31;
        setViewDescription(e);
    }

    async function handleChangeOffer(e) {
        e.preventDefault();
        if(!offer) {
            await fetchAddOffer({ description: description, name: title, price: price, quantity: maxQuantity.current.value, type: type, url: imgUrl }) &&
                await reloadOffers();
        } else {
            const changes = {};

            if(description && offer.description !== description) changes.description = description;
            if(title && offer.name !== title) changes.name = title;
            if(price && offer.price !== price) changes.price = price;
            if(maxQuantity.current.value && offer.quantity !== maxQuantity.current.value) changes.quantity = maxQuantity.current.value;
            if(type && offer.type !== type) changes.type = type;
            if(imgUrl !== 'https://cdn.pixabay.com/photo/2013/07/12/17/20/leaf-152047_1280.png' && offer.url !== imgUrl) changes.url = imgUrl;
            
            await fetchEditOffer(offer._id, changes) &&
                await reloadOffers();
        }
    }

    return (
        <>
            <form className="offer preview-offer" onSubmit={handleChangeOffer} ref={offerRef}>
                <input className="offer-edit-img-url" onChange={(e) => setImgUrl(e.target.value)} required placeholder="image url" defaultValue={offer?.url}></input>
                <br/>
                <img src={imgUrl} alt={'new offer'} className="offer-img" autoFocus></img> 
                <br/>
                <h1 className="offer-title" onClick={handleShowDescription} contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} onInput={(e) => setTitle(e.target.innerText)}>{offer?.name || 'Set Title'}</h1>
                <br/>
                <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)} description={setDescription} absolute={false}>{offer?.description || 'Set Description'}</OfferDescription>
                <div className="flex-filler"></div>
                <br/>
                <p className="offer-type" contentEditable={true} suppressContentEditableWarning={true} onInput={(e) => setType(e.target.innerText)}>{offer?.type || 'Set Type'}</p>
                <br/>
                <button className="offer-edit-confirm-button"><span>CONFIRM</span></button>
                <div className="offer-info">
                    <h2 className="offer-price" contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} onInput={(e) => setPrice(e.target.innerText)}>{offer?.price || '0.00 lv.'}</h2>
                    <Quantity quantity={offer?.quantity || 0} inpRef={maxQuantity} editMaxQuantity={true}/>
                    <svg className="add-cart-icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#5f6368"><path d="M284.53-80.67q-30.86 0-52.7-21.97Q210-124.62 210-155.47q0-30.86 21.98-52.7Q253.95-230 284.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83Zm400 0q-30.86 0-52.7-21.97Q610-124.62 610-155.47q0-30.86 21.98-52.7Q653.95-230 684.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83ZM238.67-734 344-515.33h285.33l120-218.67H238.67ZM206-800.67h589.38q22.98 0 34.97 20.84 11.98 20.83.32 41.83L693.33-490.67q-11 19.34-28.87 30.67-17.87 11.33-39.13 11.33H324l-52 96h487.33V-286H278q-43 0-63-31.83-20-31.84-.33-68.17l60.66-111.33-149.33-316H47.33V-880h121.34L206-800.67Zm138 285.34h285.33H344Z"/></svg>
                </div>
            </form>
        </>
    );
}