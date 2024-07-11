import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../utils/http';

import ProgressDialog from '../Dialogs/ProgressDialog';
import Offer from './Offer';
import AddOffer from '../admin/AddOffer';
import { useEffect, useState } from 'react';

export default function Store() {
    const { data, isPending, refetch } = useQuery({
        queryKey: ['offers'],
        queryFn: fetchOffers
    });

    const [ offers, setOffers ] = useState(null);
    const [ search, setSearch ] = useState(null);
    const [ typeSearch, setTypeSearch ] = useState(false);

    useEffect(() => {
        setOffers(data);
    }, [data]);

    useEffect(() => {
        handleSearch('mode');
    }, [typeSearch]);

    function handleSearch(e) {
        if(e === 'mode') e = { target: { value: search } };
        if(!e.target.value) {
            setOffers(data);
            setSearch('');
        }
        else {
            setSearch(e.target.value);
            setOffers(() => {
                let originalOffers = [...data];
                if(isNaN(e.target.value)) {
                    if(typeSearch) originalOffers = originalOffers.filter(offer => offer.type.toLowerCase().includes(e.target.value.toLowerCase()));
                    else originalOffers = originalOffers.filter(offer => offer.name.toLowerCase().includes(e.target.value.toLowerCase()));
                }
                else originalOffers = originalOffers.filter(offer => offer.price.includes(e.target.value));
                return originalOffers;
            });
        }
    }
    
    return (
        <>
            <div className="page-bg storepage-bg"></div>
            <div className="search-bar-wrapper">
                <input className="search-bar" placeholder="Search Product" onChange={handleSearch}></input>
                <div className="type-search">
                    <input type="radio" id="type" readOnly checked={typeSearch} onClick={() => setTypeSearch((prev) => !prev)}></input>
                    <label htmlFor="type">type</label>
                </div>
            </div>
            {
            isPending ? <ProgressDialog><h1>Loading Offers...</h1></ProgressDialog> :

            (offers &&
            <>
                <div className="offers-container-wrapper">
                    <div className="offers-container">
                        {localStorage.getItem('client') === 'admin' && <AddOffer displayType={typeSearch}/>}
                        {offers.map((offer, index) => (
                            <Offer key={index} offer={offer} searchQuery={search} displayType={typeSearch} refetchOffers={refetch}/>
                        ))}
                    </div>
                </div>
            </>
            )

            }
        </>
    );
}