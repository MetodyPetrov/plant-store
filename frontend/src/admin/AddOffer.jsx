import { useState } from "react"
import Modal from "../Dialogs/Modal";
import EditOffer from "./EditOffer";

export default function AddOffer({ reloadOffers }) {

    const [ addOffer, setAddOffer ] = useState(false);

    return (
        <>
            { addOffer && <Modal unmount={() => setAddOffer(false)}><EditOffer reloadOffers={reloadOffers}/></Modal> }
            <button className="add-offer-button" onClick={() => setAddOffer(true)}>Add Offer</button>
        </>
    )
}