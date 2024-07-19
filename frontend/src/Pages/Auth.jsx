import { useEffect, useState } from "react";
import { fetchAuth } from "../utils/http";
import { useOutletContext, useNavigate } from "react-router-dom";

import { useMutation } from '@tanstack/react-query';

export default function Auth() {
    const [ registered, setRegistered ] = useState(true);
    const { changeNavBar } = useOutletContext();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: fetchAuth,
        onSuccess: () => {
            changeNavBar({ mode: 'REPLACE', key: registered ? 'Login' : 'Register', newKey: localStorage.getItem('username'), newValue: '/account'});
            navigate('/account');
        }
    });

    useEffect(() => {
        localStorage.getItem('accessToken') && navigate('/account');
        return () => changeNavBar({ mode: 'REPLACE', key: 'Register', newKey: 'Login' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleAuth(event) {
        event.preventDefault();
        const fd = new FormData(event.target);

        if(!registered && fd.get('password') !== fd.get('confirm-password')) {
            alert('Passwords differ!');
            return;
        }
        mutate({ username: fd.get('username'), password: fd.get('password'), method: registered ? 'login' : 'register' });
    }

    function handleSwitchAuth() {
        changeNavBar({ mode: 'REPLACE', key: registered ? 'Login' : 'Register', newKey: registered ? 'Register' : 'Login' });
        setRegistered((prev) => !prev);
    }

    return (
        <>
            <form className="auth-page page-bg authpage-bg" onSubmit={handleAuth}>
                <input spellCheck="false" autoComplete="off" placeholder="Username" className="auth-input" name="username" required></input>
                <input placeholder="Password" className="auth-input" type="password" name="password" required></input>
                { registered ? 
                    <button type="button" className="auth-method-button" onClick={handleSwitchAuth}>Not registered?</button> :

                    <>
                        <input placeholder="Confirm Password" className="auth-input" type="password" name="confirm-password" required></input>
                        <button type="button" className="auth-method-button" onClick={handleSwitchAuth}>Login</button>
                    </>
                }
                <button className="auth-button">{registered ? "Login" : "Register"}</button>
            </form>
        </>
    );
}