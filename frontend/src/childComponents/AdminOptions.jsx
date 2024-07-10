import { useEffect, useRef, useState } from "react";
import { fetchOfferQuantityDecrease, fetchOfferQuantityIncrease } from "../utils/http";

export default function AdminOptions({ offerId, unmount, pos, refetchOffers }) {
    const optionsRef = useRef();
    const [ isVisible, setIsVisible ] = useState(false);

    useEffect(() => {
        const handleClick = async (event) => {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            if(!optionsRef.current?.contains(event.target) && pos.target !== event.target) {
                setIsVisible(false);
                await delay(200);
                unmount();
            }
        }

        document.addEventListener('mousedown', handleClick);
        setIsVisible(true);

        return () => document.removeEventListener('mousedown', handleClick);
    }, [unmount, pos.target]);

    async function changeQuantity(mode) {
        mode === 'increase' ? await fetchOfferQuantityIncrease(offerId) : await fetchOfferQuantityDecrease(offerId);
        refetchOffers();
    }

    return (
        <div ref={optionsRef} style={{
            position: 'absolute',
            left: pos.clientX,
            top: pos.clientY
        }} className={`opacity-appearance ${isVisible ? 'visible' : ''}`}>
            <button className="admin-plus-button" onClick={() => changeQuantity('increase')}><span>+</span></button>
            <button className="admin-minus-button" onClick={() => changeQuantity('decrease')}><span>-</span></button>
        </div>
    )
}