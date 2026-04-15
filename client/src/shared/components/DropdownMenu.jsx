import { useEffect, useRef } from "react";

export default function DropdownMenu({ isOpen, onClose, children, triggerRef }) {
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-10 bg-mybg2 rounded-sm shadow-2xl w-45 p-2 z-50"
        >
            {children}
        </div>
    );
}