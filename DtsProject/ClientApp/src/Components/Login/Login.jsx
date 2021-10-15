import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Http from '../../General/Http.js';
import './Login.css';
import useToastContext from '../../CustomHooks/useToastContext.jsx';
import useLoadingContext from '../../CustomHooks/useLoadingContext.jsx';


const Login = () => {

    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorMsgName, setErrorMsgName] = useState('');
    const [errorMsgEmail, setErrorMsgEmail] = useState('');
    const [errorMsgPassword, setErrorMsgPassword] = useState('');
    const inputNameRef = useRef();
    const inputUserRef = useRef();
    const inputPasswordRef = useRef();
    const history = useHistory();
    const addToToastList = useToastContext();
    const showLoading = useLoadingContext();
    
    const loginApp = () => {
        setErrorMsg('');
        let isValidName = true;
        if (name === '') {
            setErrorMsgName(' נא להזין שם משתמש');
            isValidName = false;
        }
        const regexEnglish = /^[a-zA-Z]{1,}$/;
        if (!regexEnglish.test(name) && isValidName) {
            setErrorMsgName('שם משתמש באנגלית בלבד')
            isValidName = false;
        }
        isValidName && setErrorMsgName('');
        let isValidatePassword = true;
        if (password === '') {
            setErrorMsgPassword('נא להזין סיסמה');
            isValidatePassword = false;
        }
        const regulerPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regulerPassword.test(password) && isValidatePassword) {
            setErrorMsgPassword("סיסמה צריכה להכיל לפחות 8 תוים, אות קטנה, גדולה, מספר, תו מיוחד");
            isValidatePassword = false;
        }
        isValidatePassword && setErrorMsgPassword('');

        let isValidateEmail = true;
        if (userName === '') {
            setErrorMsgEmail("נא להזין שם משתמש");
            isValidateEmail = false;
        }
        const regularEmail = /^\S+@\S+\.\S+$/;
        if (!regularEmail.test(userName) && isValidateEmail) {
            setErrorMsgEmail('כתובת מייל לא תקינה');
            isValidateEmail = false;
        }
        isValidateEmail && setErrorMsgEmail('');
        if (!isValidName) {
            inputNameRef.current.focus();
            return;
        }
        if (!isValidateEmail) {
            inputUserRef.current.focus();
            return;
        }
        if (!isValidatePassword) {
            inputPasswordRef.current.focus();
            return;
        }
        showLoading(true);
        Http.Post('Api/Login/LoginApp', { userName, password }).then(res => {
            showLoading(false);
            if (!res.ok) {
                res.text()
                    .then(error => {
                        setErrorMsg(JSON.parse(error));
                        addToToastList('warning', JSON.parse(error));
                        inputUserRef.current.focus();
                    });
            }
            else {
                sessionStorage.setItem('user', JSON.stringify({ email: userName, name }))
                addToToastList('info', 'כניסה בוצעה בהצלחה')
                history.push('/QueueBarbershop');
            }
        });
    }

    const eventsKeyboard = (event) => {
        if (event.charCode === 13) {
            loginApp();
        }

        if (event.getModifierState('CapsLock'))
            setErrorMsg('דולק CapsLock');
        else
            setErrorMsg('');
    }

    useEffect(() => {
        inputNameRef.current.focus();
    }, []);

    return (
            <>

                <div className="login-root">
                    <div className="container-logo">
                        <div className="logo"></div>
                    </div>
                    <div className="login">
                        <div className="login-header">
                            <h1>התחברות</h1>
                        </div>
                        <div className="login-form">
                        {/*<h3>שם משתמש</h3>*/}
                            <div className="input-container">
                                <i className="fa fa-male icon"></i>
                                <input type="text" value={name} id="name-input" ref={inputNameRef} onKeyPress={eventsKeyboard} onChange={e => setName(e.currentTarget.value)} />
                                <span className={`text-float-input ${name !== '' && "valid-input"}`}>...הכנס שם פרטי</span>
                                <label htmlFor='name-input' className="error-msg">{errorMsgName}</label>
                            </div>
                            <div className="input-container">
                                <i className="fa fa-envelope icon"></i>
                                <input type="email" value={userName} id="email-input" ref={inputUserRef} onKeyPress={eventsKeyboard} onChange={e => setUserName(e.currentTarget.value)} />
                                <span className={`text-float-input ${userName !== '' && "valid-input"}`}>...הכנס כתובת מייל</span>
                                <label htmlFor='email-input' className="error-msg">{errorMsgEmail}</label>
                            </div>
                            {/*<br />*/}
                            {/*<h3>סיסמה</h3>*/}
                            <div className="input-container">
                                <i className="fa fa-key icon"></i>
                                <input type="password" value={password} id="password-input" ref={inputPasswordRef} onKeyPress={eventsKeyboard} onChange={e => setPassword(e.currentTarget.value)} />
                                <span className={`text-float-input ${password !== '' && "valid-input"}`}>...הכנס סיסמה</span>
                                <label htmlFor='password-input' className="error-msg">{errorMsgPassword}</label>
                        </div>
                        {/*<br />*/}
                            <div className="futur-login">
                                <div className="container-btn-login">
                                    <input type="button" value="כניסה" id='btn-login' className="login-button" onClick={loginApp} />
                                </div>
                                {/*<br />*/}
                                <div className="links-login">
                                    <NavLink to='/CreateAccount' className="sign-up link">משתמש חדש</NavLink>
                                    <NavLink to='/ForgetPassword' className="no-access link">שכחתי סיסמה</NavLink>
                                </div>
                            </div>
                            <div htmlFor='btn-login' className="error-msg btn-error-msg">{errorMsg}</div>
                        </div>
                    </div>
                </div>
            </>
        );
}
export default Login;