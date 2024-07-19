import { isValidImageUrl } from "./functions";

export async function fetchOffers({ signal }) {
    const response = await fetch('http://localhost:3000/offers', { 
        signal: signal,
        headers: {
            'X-Authorization': localStorage.getItem('accessToken')
        }
    });
    
    if(!response.ok) throw new Error((await response.json()).message);
    else return response.json();
}

export async function fetchAddOffer(offer) {
    const isValidImage = await isValidImageUrl(offer.url);
    if(!isValidImage) {
        alert('Invalid image url.');
        return;
    }

    const response = await fetch('http://localhost:3000/admin/offers/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify(offer)
    });

    const output = (await response.json()).message;

    alert(output);
    if(!response.ok) throw new Error(output);
    else return true;
}

export async function fetchEditOffer({ offerId, offerChanges }) {
    if(offerChanges.url) {
        const isValidImage = await isValidImageUrl(offerChanges.url);
        if(!isValidImage) {
            alert('Invalid image url.');
            return;
        }
    }
    
    const response = await fetch(`http://localhost:3000/admin/offers/${offerId}/edit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify(offerChanges)
    });

    const output = (await response.json()).message;
    
    alert(output);
    if(!response.ok) throw new Error(output);
    else return true;
}

export async function fetchOfferQuantityChange({ offerId, quantity = 1, mode }) {
    const response = await fetch(`http://localhost:3000/admin/offers/${offerId}/${mode}-quantity`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ quantity })
    });

    const output = (await response.json()).message;

    if(!response.ok) {
        alert(output);
        throw new Error(output);
    }
    else return true;
}

export async function fetchAuth({ username, password, method }) {
    const response = await fetch(`http://localhost:3000/accounts/${method}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ username, password })
    });

    if(!response.ok) throw new Error((await response.json()).message);
    else {
        const res = await response.json();
        alert(res.message);
        
        if(res.data) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('client', res.authorization);
            localStorage.setItem('credit', res.credit);
        }
        return res;
    }
}

export async function fetchGenerateCredit({ credit }) {
    const response = await fetch('http://localhost:3000/admin/credit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ credit })
    });

    if(!response.ok) throw new Error((await response.json()).message);
    else {
        alert((await response.json()).message);
        localStorage.setItem('credit', credit * 1 + localStorage.getItem('credit') * 1);
    }
}

export async function fetchPurchaseHistory() {
    const response = await fetch('http://localhost:3000/purchase/history', {
        headers: {
            'X-Authorization': localStorage.getItem('accessToken')
        }
    });

    if(!response.ok) throw new Error((await response.json()).message);
    else {
        return await response.json();
    }
}

export async function fetchCartCheckout({ cart }) {
    if(!localStorage.getItem('accessToken')) return;
    const request = cart.map(prod => ({ id: prod._id, amount: prod.buyQuantity }));

    const response = await fetch('http://localhost:3000/purchase/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify(request)
    });
    
    const output = (await response.json()).message;

    alert(output);
    if(response.ok) localStorage.setItem('credit', cart.reduce((credit, product) => credit - product.buyQuantity * parseFloat(product.price, 10).toFixed(2) * 100, localStorage.getItem('credit')));
    else throw new Error(output);
    return true;
}