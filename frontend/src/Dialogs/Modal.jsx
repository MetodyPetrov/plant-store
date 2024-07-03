import { useRef, useEffect } from "react";

export default function Modal({ children, unmount }) {
    const dialog = useRef(null);
    const inside = useRef(null);

    useEffect(() => {
        dialog.current && dialog.current.showModal(); 
        const handleClick = (event) => !inside.current?.contains(event.target) && unmount();
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [children, unmount]);

    return (
        <dialog ref={dialog} className="modal-dialog">
            <div ref={inside}>
                {children}
            </div>
        </dialog>
    );
}