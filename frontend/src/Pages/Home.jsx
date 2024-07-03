import { useEffect, useState } from "react";

export default function HomePage() {
    const [isLoaded, setIsLoaded] = useState(false);

    const images = [
        {url: "https://cdn.pixabay.com/photo/2022/11/28/06/00/winter-7621278_1280.jpg", alt: "winter bushes"},
        {url: "https://cdn.pixabay.com/photo/2012/07/28/17/34/yellow-53232_1280.jpg", alt: "savannah bushes"},
        {url: "https://cdn.pixabay.com/photo/2020/05/06/19/42/bach-5138934_1280.jpg", alt: "beautiful nature park bushes"}
    ];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <div className="page-bg homepage-bg"></div>
            <div className="homepage">
                <h1>Bushes are very cool!</h1>
                <h4>Here are some highlights:</h4>
                {
                    images.map((image, index) => (
                        <div key={index}>
                            <br/>
                            <img 
                                className="highlight-img"
                                style={{animation: isLoaded ? `${index % 2 ? 'slideIn-left' : 'slideIn-right'} 1s ease-out forwards ${index * 0.5}s` : 'none', opacity: 0}}
                                src={image.url}
                                alt={image.alt}
                            ></img>
                        </div>
                    ))
                }
                <h2>Bushes are important!</h2>
            </div>
        </>
    );
} 