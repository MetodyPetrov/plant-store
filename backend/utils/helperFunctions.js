const { Int32 } = require('mongodb');
const { getCollection } = require('./utils');

async function validateOfferInfo(offerInfo, mode) {
    const collection = await getCollection('offers');
    let offer;
    if(mode === 'full')  {
        offer = {
            name: offerInfo.name,
            price: offerInfo.price,
            quantity: new Int32(offerInfo.quantity),
            type: offerInfo.type,
            url: offerInfo.url,
            description: offerInfo.description
        }
    } else {
        offer = offerInfo;
    }

    // IMPORTANT: Image validation must be part of the frontend

    for (const key in offer) {
        if (offer.hasOwnProperty(key)) {
            if(!offer[key]) throw new Error(`Undefined offer property: ${key}`);
        }
    }

    const validatePrice = /^\d{2}\.\d{2} lv\.$/;

    if(offer.quantity && isNaN(offer.quantity)) throw new Error('Invalid offer quantity');
    if(offer.price && (isNaN(parseFloat(offer.price, 10).toFixed(2)) || !validatePrice.test(offer.price))) throw new Error('Invalid offer price');
    if(offer.description && typeof offer.description !== 'string') throw new Error('Invalid offer description');

    if(offer.name) {
        const existingOffer = await collection.findOne({ name: offer.name });
        if(existingOffer) throw new Error('Offer already exists');
    }
    return true;
}

module.exports = { validateOfferInfo };