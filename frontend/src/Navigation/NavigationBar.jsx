import { useReducer } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { CartProvider } from '../Purchase/CartContext';
import CartIcon from '../childComponents/CartIcon';

const defaultNavBar = new Map([
    [ 'Home', '/home' ],
    [ 'Store', '/store'],
    [ 'About Bushes', '/bushes' ],
    [ 'Login', '/authenticate' ]
]);

function navbarReducer(state, action) {
    const newMap = new Map(state);
    let entries, index;
    
    switch (action.type) { // should be of kind ({ key, newKey, newValue}) 
        case 'RESET':
            return new Map(defaultNavBar);

        case 'REPLACE':
            entries = Array.from(state.entries());
            index = entries.findIndex(([ mapKey ]) => mapKey === action.key);
            
            if(index !== -1) entries[index] = [ action.newKey, action.newValue || newMap.get(action.key) ];
            return new Map(entries);

        case 'ADD':
            newMap.set(action.newKey, action.newValue);
            return new Map(newMap);
        case 'DELETE':
            newMap.delete(action.key);
            for (const [value1] of newMap) { // in case it's an object (component, html, etc...)
                for (const [value2] of newMap) {
                    if(value1.props && value2.props && value1.props === value2.props) newMap.delete(value1);
                }
            }
            return new Map(newMap);

        default:
            return state;
    }
}

export default function NavigationBar() {
    const [ navbar, navbarDispatch ] = useReducer(navbarReducer, initNavBar());

    function initNavBar() {
        let initNavBar = new Map(defaultNavBar);

        if(localStorage.getItem('username')) {
            const entries = Array.from(defaultNavBar.entries());
            const index = entries.findIndex(([ mapKey ]) => mapKey === 'Login');
            if(index !== -1) entries[index] = [ localStorage.getItem('username'), '/account' ];
            initNavBar = new Map(entries);
        } if(JSON.parse(localStorage.getItem('cart'))?.length) {
            initNavBar.set(<CartIcon className="cart-icon"/>, '/cart');
        }
        return new Map(initNavBar);
    }  // done with initNavBar so that no useEffect() is used, because it caused a flash between Login and the username on initial page load

    function changeNavBar({ mode, ...payload }) {
        navbarDispatch({
            type: mode,
            ...payload
        });
    }

    function checkNavBarPageExist(key) {
        if(navbar.has(key)) return true;
        for (const [value1] of navbar) { // in case it's an object (component, html, etc...)
            for (const [value2] of navbar) {
                if(value1.props && value2.props && value1.props === value2.props) return true;
            }
        }
        return false;
    }

    return (
        <>
            <CartProvider>
                <div className="nav-bar">
                    {Array.from(navbar.keys()).map(key => (
                        <NavLink 
                            key={key} 
                            to={navbar.get(key)} 
                            className={(isActive) => isActive.isActive ? 'selected-page' : 'unselected-page'}
                        >
                            {key}
                        </NavLink>
                    ))}
                </div>
                <main>
                    <Outlet context={{ changeNavBar, checkNavBarPageExist }}/>
                </main>
                <footer>No rights reserved</footer>
            </CartProvider>
        </>
    );
}