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

export async function fetchOfferQuantityChange(offerId, quantity = 1, mode) {
    const response = await fetch(`http://localhost:3000/admin/offers/${offerId}/${mode}-quantity`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({ quantity })
    });

    if(!response.ok) alert(`Unsuccessful ${mode}.`);
    else return true;
}

export async function fetchAuth(username, password, method) {
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

export async function fetchGenerateCredit(credit) {
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

export async function fetchCartCheckout(cart) {
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
    alert((await response.json()).message);
    if(response.ok) localStorage.setItem('credit', cart.reduce((credit, product) => credit - product.buyQuantity * parseFloat(product.price, 10).toFixed(2) * 100, localStorage.getItem('credit')));
    else return false;
    return true;
}