import { useState, useRef, useEffect } from "react";

export default function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const selected = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-2 border-2 border-mylight rounded-md bg-mybg cursor-pointer flex justify-between items-center"
            >
                <span className={`${!selected ? "opacity-50" : ""}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-mybg border-2 border-mylight rounded-md max-h-50 overflow-y-auto shadow-lg">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`p-2 cursor-pointer hover:bg-white/10 transition ${value === opt.value ? "bg-white/20" : ""
                                }`}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}