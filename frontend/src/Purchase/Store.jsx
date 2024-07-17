import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../utils/http';

import ProgressDialog from '../Dialogs/ProgressDialog';
import Offer from './Offer';
import { useEffect, useState } from 'react';
import AddOffer from "../admin/AddOffer";

export default function Store() {
    const { data, isPending, refetch } = useQuery({
        queryKey: ['offers'],
        queryFn: fetchOffers
    });

    const [ offers, setOffers ] = useState(null);

    const [ searchMode, setSearchMode ] = useState('default');

    const [ defaultSearch, setDefaultSearch ] = useState(null);
    const [ typeSearch, setTypeSearch ] = useState(false);

    useEffect(() => {
        console.log(data[0].name);
        setOffers(data);
    }, [data]);

    useEffect(() => {
        if(!typeSearch && !defaultSearch) {
            setOffers(data);
        } else {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ typeSearch, defaultSearch, searchMode ]);

    function handleSearch() {
        setOffers(() => {
            let originalOffers = [...data];

            if(defaultSearch && isNaN(defaultSearch)) originalOffers = originalOffers.filter(offer => offer.name.toLowerCase().includes(defaultSearch.toLowerCase()));
            else if(defaultSearch) originalOffers = originalOffers.filter(offer => offer.price.toLowerCase().includes(defaultSearch.toLowerCase()));

            if(searchMode === 'type' && typeSearch) {
                originalOffers = originalOffers.filter(offer => offer.type.toLowerCase().includes(typeSearch.toLowerCase()));
                // TODO: go through typeSearch and seperate types using ',' e.g. "Type: Evergreen, Hebe Schrub, Lily" and when the user searches for 'Evegreen, Lily they should highlight'
            }

            return originalOffers;
        });
    }
    
    return (
        <>
            <div className="page-bg storepage-bg"></div>
            <div className="search-bar-wrapper">
                <input className="search-bar" placeholder="Search Product" onChange={(e) => setDefaultSearch(e.target.value)}></input>
                <div className="type-search">
                    <input type="search" className="type-input" onChange={(e) => setTypeSearch(e.target.value)}></input>
                    <input type="radio" id="type" readOnly checked={searchMode === 'type'} onClick={() => setSearchMode((mode) => mode === 'default' ? 'type' : 'default')}></input> 
                    <label htmlFor="type">type</label>
                </div>
            </div>
            {
            isPending ? <ProgressDialog><h1>Loading Offers...</h1></ProgressDialog> :

            (offers &&
            <>
                <div className="offers-container-wrapper">
                    <div className="offers-container">
                        {localStorage.getItem('client') === 'admin' &&
                            <AddOffer reloadOffers={refetch}/>
                        }
                        {offers.map((offer) => <Offer key={offer._id} offer={offer} searchQuery={{ name: defaultSearch, type: typeSearch, price: defaultSearch }} displayType={searchMode === 'type'} refetchOffers={refetch}/> )}
                    </div>
                </div>
            </>
            )

            }
        </>
    );
}