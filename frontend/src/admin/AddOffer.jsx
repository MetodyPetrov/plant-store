import { useRef, useState } from "react";

import Quantity from "../childComponents/Quantity";
import OfferDescription from "../childComponents/OfferDescription";
import Modal from "../Dialogs/Modal";
import Offer from "../Purchase/Offer";
import { fetchAddOffer } from "../utils/http";

export default function AddOffer({ reloadOffers }) {
    const [ imageAdd, setImageAdd ] = useState(false);
    const [ viewDescription, setViewDescription ] = useState(false);
    const [ previewOffer, setPreviewOffer ] = useState(false);

    const maxQuantity = useRef(null);
    const [ title, setTitle ] = useState();
    const [ description, setDescription ] = useState(true);
    const [ type, setType ] = useState();
    const [ price, setPrice ] = useState();
    const [ imgUrl, setImgUrl ] = useState();

    async function handleAddNewOffer(e) {
        if(e === 'confirmed') {
            await fetchAddOffer({ description: description, name: title, price: price, quantity: maxQuantity.current.value, type: type, url: imgUrl }) &&
                setPreviewOffer(false) && 
                    await reloadOffers();
        } else {
            e.preventDefault();
            setPreviewOffer(true);
        }
    }

    return (
        <>
            { imageAdd && <Modal unmount={() => setImageAdd(false)}>
                <form className="img-add-container" onSubmit={(e) => { e.preventDefault(); setImageAdd(false); }}>
                    <input onChange={(e) => setImgUrl(e.target.value)} required placeholder="image url"></input>
                    <button className="admin-plus-button" style={{border: 'solid black 1px', marginTop: '30px' }}><svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#5f6368"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></button>
                </form>
            </Modal> }

            { previewOffer && <Modal unmount={() => setPreviewOffer(false)}>
                <form onSubmit={(e) => { e.preventDefault(); handleAddNewOffer('confirmed'); }}>
                    <Offer offer={{ description: description, name: title, price: price, quantity: maxQuantity.current.value, type: type, url: imgUrl }} displayType={true} adminOptions={false} className={"preview-offer"}/>
                    <button className="add-offer-confirm">Confirm</button>
                </form>
            </Modal> }

            <form className="offer add-offer" onSubmit={handleAddNewOffer}>
                <img src="https://cdn.pixabay.com/photo/2013/07/12/17/20/leaf-152047_1280.png" alt={'new offer'} className="offer-img add-offer-img" onClick={() => setImageAdd(true)}></img>
                <br/>
                <h1 className="offer-title" onClick={(e) => setViewDescription(e)} contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} onInput={(e) => setTitle(e.target.innerText)}>Set Title</h1>

                { viewDescription && <OfferDescription pos={viewDescription} unmount={() => setViewDescription(false)} classes="add-offer-description" description={setDescription}>Set Description</OfferDescription>}
                <div className="flex-filler"></div>
                <p className="offer-type" contentEditable={true} suppressContentEditableWarning={true} onInput={(e) => setType(e.target.innerText)}>Set Type</p>
                <br/>
                <button className="admin-plus-button offer-create-button"><span>+</span></button>
                <div className="offer-info">
                    <h2 className="offer-price" contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} onInput={(e) => setPrice(e.target.innerText)}>0.00 lv.</h2>
                    <Quantity inpRef={maxQuantity} editMaxQuantity={true}/>
                    <svg className="add-cart-icon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#5f6368"><path d="M284.53-80.67q-30.86 0-52.7-21.97Q210-124.62 210-155.47q0-30.86 21.98-52.7Q253.95-230 284.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83Zm400 0q-30.86 0-52.7-21.97Q610-124.62 610-155.47q0-30.86 21.98-52.7Q653.95-230 684.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83ZM238.67-734 344-515.33h285.33l120-218.67H238.67ZM206-800.67h589.38q22.98 0 34.97 20.84 11.98 20.83.32 41.83L693.33-490.67q-11 19.34-28.87 30.67-17.87 11.33-39.13 11.33H324l-52 96h487.33V-286H278q-43 0-63-31.83-20-31.84-.33-68.17l60.66-111.33-149.33-316H47.33V-880h121.34L206-800.67Zm138 285.34h285.33H344Z"/></svg>
                </div>
            </form>
        </>
    );
}