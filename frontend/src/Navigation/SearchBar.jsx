import PriceRange from "../childComponents/PriceRange";

export default function SearchBar({ setTypeSearch, setDefaultSearch, searchMode, setSearchMode, maxOfferPrice, priceChange }) {
    return (
        <div className="search-bar-wrapper">
            <PriceRange max={maxOfferPrice} onChange={priceChange}/>
            <input className="search-bar" placeholder="Search Product" onChange={(e) => setDefaultSearch(e.target.value)}></input>
            <div className="type-search">
                <input type="search" className="type-input" onChange={(e) => setTypeSearch(e.target.value)}></input>
                <input type="radio" id="type" readOnly checked={searchMode === 'type'} onClick={() => setSearchMode((mode) => mode === 'default' ? 'type' : 'default')}></input> 
                <label htmlFor="type">type</label>
            </div>
        </div>
    )
}