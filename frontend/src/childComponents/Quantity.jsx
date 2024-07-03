import { useState } from "react";

export default function Quantity({ quantity = 0, inpRef }) {
    const [ amount, setAmount ] = useState(1);
    return (
        <div className="quantity-selector">
            <span className="quantity-change" onClick={() => inpRef && inpRef.current.stepDown()}>-</span>
            <input type="number" min="1" max={quantity} ref={inpRef} value={amount} onChange={(e) => e.target.value <= quantity * 1 && setAmount(e.target.value)}></input>
            <span className="max-quantity">/{quantity}</span>
            <span className="quantity-change" onClick={() => inpRef && inpRef.current.stepUp()}>+</span>
        </div>
    );
}