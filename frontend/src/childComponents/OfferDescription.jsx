import { useEffect, useRef } from "react";

export default function OfferDescription({ pos, children, unmount, classes = '' }) {
    const descriptionRef = useRef();

    useEffect(() => {
        const handleClick = (event) => !descriptionRef.current?.contains(event.target) && pos.target !== event.target && unmount();
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [unmount, pos.target]);

    return (
        <p style={{
            position: 'absolute',
            left: pos.clientX,
            top: pos.clientY
        }} className={"offer-description " + classes} ref={descriptionRef}>{children}</p>
    );
}