import { useEffect, useRef } from "react";

export default function OfferDescription({ pos, children, unmount, classes = '', description }) {
    const descriptionRef = useRef(null);

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
            left: pos.clientX + window.scrollX,
            top: pos.clientY + window.scrollY
        }} className={"offer-description " + classes} ref={descriptionRef} contentEditable={description && true} suppressContentEditableWarning={description && true} onInput={(e) => description(e.target.innerText)}>{children}</p>
    );
}