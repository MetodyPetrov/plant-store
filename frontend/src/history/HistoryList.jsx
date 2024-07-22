import { useQuery } from '@tanstack/react-query';
import { fetchPurchaseHistory } from '../utils/http';
import Purchase from './Purchase';

export default function HistoryList() {
    const { data, isPending } = useQuery({
        queryKey: ['purchase-history'],
        queryFn: fetchPurchaseHistory
    });
    return (
        isPending ? 'Loading...' :
        <>
        {data.map((purchaseInfo, index) => (
            <li value={data.length - index} key={index}><Purchase purchase={purchaseInfo} bundledTop={ purchaseInfo.date === data[index-1]?.date } bundledBottom={ purchaseInfo.date === data[index+1]?.date }/></li>
        ))}
        </>
    )
}