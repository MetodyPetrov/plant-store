import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fetchGenerateCredit } from "../utils/http";

export default function Account() {
    const navigate = useNavigate();
    const { changeNavBar } = useOutletContext();
    const [ credit, setCredit ] = useState(localStorage.getItem('credit') || 0);

    useEffect(() => {
        localStorage.getItem('accessToken') || navigate('/authenticate');
    }, [navigate]);

    function handleLogout() {
        changeNavBar({ mode: 'REPLACE', key: localStorage.getItem('username'), newKey: 'Login', newValue: '/authenticate' });
        localStorage.clear();
        navigate('/');
    }

    async function handleAddCredit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        await fetchGenerateCredit(fd.get('credit'));
        setCredit(localStorage.getItem('credit'));
    }

    return (
        <>
            <div className="page-bg authpage-bg"></div>
            <div className="account-page">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                <br/>
                <h1>CREDIT: {credit} leva</h1>
                <br/>
                { localStorage.getItem('client') === 'admin' && 
                    <>
                        <form onSubmit={handleAddCredit} className="add-credit-form">
                            <button>Add credit</button>
                            <input defaultValue={2000} name="credit" required></input>
                        </form>
                        <br/>
                    </>
                }
                <ol> Purchase history:
                    
                </ol>
            </div>
        </>
    )
}