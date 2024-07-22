import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../utils/http';

import ProgressDialog from '../Dialogs/ProgressDialog';
import Offer from './Offer';
import { useEffect, useState } from 'react';
import AddOffer from "../admin/AddOffer";
import SearchBar from '../Navigation/SearchBar';
import { formatNumber } from '../utils/functions';

export default function Store() {
    const { data, isPending } = useQuery({
        queryKey: ['offers'],
        queryFn: fetchOffers
    });

    const [ offers, setOffers ] = useState(null);

    const [ searchMode, setSearchMode ] = useState('default');

    const [ defaultSearch, setDefaultSearch ] = useState(null);
    const [ typeSearch, setTypeSearch ] = useState(false);

    const [ priceRange, setPriceRange ] = useState({ 
        min: 0,
        max: undefined 
    });

    useEffect(() => {
        setOffers(data);
        setPriceRange(prev => ({
            ...prev,
            max: data?.reduce((max, offer) => parseFloat(offer.price) > max ? parseFloat(offer.price) : max, 0)
        }));
    }, [data]);

    useEffect(() => {
        if(data) handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ typeSearch, defaultSearch, searchMode, priceRange ]);

    function handleSearch() {
        setOffers(() => {
            let originalOffers = [...data];

            if(defaultSearch && isNaN(defaultSearch)) originalOffers = originalOffers.filter(offer => offer.name.toLowerCase().includes(defaultSearch.toLowerCase()));
            else if(defaultSearch) originalOffers = originalOffers.filter(offer => offer.price.toLowerCase().includes(defaultSearch.toLowerCase()));

            if(priceRange.max) originalOffers = originalOffers.filter(offer => formatNumber(offer.price) >= priceRange.min && formatNumber(offer.price) <= priceRange.max);

            if(searchMode === 'type' && typeSearch) {
                const typeSearchQuery = typeSearch.split(',');
                originalOffers = originalOffers.filter(offer => {
                    for (const type of typeSearchQuery) {
                        if(!offer.type.toLowerCase().includes(type.trim())) return false;
                    }
                    return true;
                });
                // TODO: go through typeSearch and seperate types using ',' e.g. "Type: Evergreen, Hebe Schrub, Lily" and when the user searches for 'Evegreen, Lily they should highlight'
            }

            return originalOffers;
        });
    }

    function handlePriceChange(newMax, newMin) {
        setPriceRange({
            max: newMax,
            min: newMin
        });
    }

    const maxOfferPrice = data?.reduce((max, offer) => parseFloat(offer.price) > max ? parseFloat(offer.price) : max, 0);
    
    return (
        <>
            <div className="page-bg storepage-bg"></div>
            <SearchBar setTypeSearch={setTypeSearch} setDefaultSearch={setDefaultSearch} searchMode={searchMode} setSearchMode={setSearchMode} maxOfferPrice={maxOfferPrice} priceChange={handlePriceChange}/>
            {
            isPending ? <ProgressDialog><h1>Loading Offers...</h1></ProgressDialog> :

            (offers &&
            <>
                <div className="offers-container-wrapper">
                    <div className="offers-container">
                        {localStorage.getItem('client') === 'admin' &&
                            <AddOffer/>
                        }
                        {offers.map((offer) => <Offer key={offer._id} offer={offer} searchQuery={{ name: defaultSearch, type: typeSearch, price: defaultSearch }} displayType={searchMode === 'type'}/> )}
                    </div>
                </div>
            </>
            )

            }
        </>
    );
}