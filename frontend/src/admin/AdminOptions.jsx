import { useEffect, useRef, useState } from "react";
import { fetchOfferQuantityChange } from "../utils/http";

import { useMutation } from '@tanstack/react-query';

export default function AdminOptions({ offerId, unmount, pos, refetchOffers }) {
    const optionsRef = useRef();
    const [ isVisible, setIsVisible ] = useState(false);

    const { mutate, isError } = useMutation({
        mutationFn: fetchOfferQuantityChange,
        onSuccess: refetchOffers
    });

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
        mutate({ offerId: offerId, quantity: 1, mode: mode });
    }

    return (
        <div ref={optionsRef} style={{
            position: 'absolute',
            left: pos.clientX + window.scrollX,
            top: pos.clientY + window.scrollY
        }} className={`opacity-appearance ${isVisible ? 'visible' : ''}`}>
            <button className="admin-plus-button" onClick={() => changeQuantity('increase')} disabled={isError}><span>+</span></button>
            <button className="admin-minus-button" onClick={() => changeQuantity('decrease')} disabled={isError}><span>-</span></button>
        </div>
    )
}