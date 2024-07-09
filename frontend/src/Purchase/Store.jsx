import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../utils/http';

import ProgressDialog from '../Dialogs/ProgressDialog';
import Offer from './Offer';
import AddOffer from '../childComponents/AddOffer';
import { useEffect, useState } from 'react';

export default function Store() {
    const { data, isPending } = useQuery({
        queryKey: ['offers'],
        queryFn: fetchOffers
    });

    const [ offers, setOffers ] = useState(null);
    const [ search, setSearch ] = useState(null);

    useEffect(() => {
        setOffers(data);
    }, [data]);

    function handleSearch(e) {
        if(!e.target.value) {
            setOffers(data);
            setSearch('');
        }
        else {
            setSearch(e.target.value);
            setOffers(() => {
                if(isNaN(e.target.value)) return data.filter(offer => offer.name.toLowerCase().includes(e.target.value.toLowerCase()));
                else return data.filter(offer => offer.price.includes(e.target.value));
            });
        }
    }
    
    return (
        <>
            <div className="page-bg storepage-bg"></div>
            <div className="search-bar-wrapper">
                <input className="search-bar" placeholder="Search Product" onChange={handleSearch}></input>
            </div>
            {
            isPending ? <ProgressDialog><h1>Loading Offers...</h1></ProgressDialog> :

            (offers &&
            <>
                <div className="offers-container-wrapper">
                    <div className="offers-container">
                        {localStorage.getItem('client') === 'admin' && <AddOffer />}
                        {offers.map((offer, index) => (
                            <Offer key={index} offer={offer} searchQuery={search}/>
                        ))}
                    </div>
                </div>
            </>
            )

            }
        </>
    );
}