export default function Purchase({ purchase, bundledTop = false, bundledBottom = false }) {
    const date = new Date(purchase.date);

    let styling;
    if(bundledTop) {
        styling = { 
            marginTop: '0px',
            borderTop: '0px',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px'
        };
    }
    if(bundledBottom) {
        styling = {
            ...styling,
            marginBottom: '0px',
            borderBottom: '0px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px'
        }
    }

    return (
        <div className="purchase-history-container" style={styling}>
            <h2>{'Product Name: ' + purchase.product}</h2>
            <h3>{'Amount: ' + purchase.amount}</h3>
            <h4>{'Date: ' + date}</h4>
            <p>{'id: ' + purchase._id}</p>
        </div>
    )
}