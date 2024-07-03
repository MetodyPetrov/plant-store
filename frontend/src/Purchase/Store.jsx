import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '../utils/http';

import ProgressDialog from '../Dialogs/ProgressDialog';
import Offer from './Offer';
import AddOffer from '../childComponents/AddOffer';

export default function Store() {
    const { data, isPending } = useQuery({
        queryKey: ['offers'],
        queryFn: fetchOffers
    });

    return (
        <>
            <div className="page-bg storepage-bg"></div>
            {
            isPending ? <ProgressDialog><h1>Loading Offers...</h1></ProgressDialog> :

            (data &&
            <>
                <div className="offers-container-wrapper">
                    <div className="offers-container">
                        {localStorage.getItem('client') === 'admin' && <AddOffer />}
                        {data.map((offer, index) => (
                            <Offer key={index} offer={offer}/>
                        ))}
                    </div>
                </div>
            </>
            )

            }
        </>
    );
}