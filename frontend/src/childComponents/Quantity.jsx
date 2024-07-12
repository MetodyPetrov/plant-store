import { useState } from "react";

export default function Quantity({ quantity = 0, inpRef, editMaxQuantity = false }) {
    const [ amount, setAmount ] = useState(1);
    return (
        <div className="quantity-selector">
            <span className="quantity-change" onClick={() => inpRef && inpRef.current.stepDown()} style={editMaxQuantity ? {cursor: 'not-allowed'} : {}}>-</span>
            <input type="number" className="input-quantity" min="1" max={quantity} ref={editMaxQuantity ? undefined : inpRef} value={amount} onChange={(e) => e.target.value <= quantity * 1 && setAmount(e.target.value)} disabled={editMaxQuantity}></input>
            { editMaxQuantity ? 
            <input className="max-quantity admin" contentEditable={editMaxQuantity} suppressContentEditableWarning={true} style={editMaxQuantity ? {cursor: 'pointer'} : {}} ref={editMaxQuantity ? inpRef : undefined} defaultValue={quantity}></input>: 
            <span className="max-quantity" contentEditable={editMaxQuantity} suppressContentEditableWarning={true} style={editMaxQuantity ? {cursor: 'pointer'} : {}} ref={editMaxQuantity ? inpRef : undefined}>/{quantity}</span>
            }
            <span className="quantity-change" onClick={() => inpRef && inpRef.current.stepUp()} style={editMaxQuantity ? {cursor: 'not-allowed'} : {}}>+</span>
        </div>
    );
}