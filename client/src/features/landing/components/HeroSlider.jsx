import { useEffect, useState } from "react";

export default function HeroSlider({children}) {
    const images = [
        '/landing-page-images/1.jpg',
        '/landing-page-images/2.jpg',
        '/landing-page-images/3.jpg'
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-3/5 relative">
            <img
                className="w-full h-full object-cover rounded-3xl"
                src={images[index]}
                alt=""
            />
            {children}
        </div>
    );
}