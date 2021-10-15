import React, { useEffect, useRef, useState } from 'react';
import './CreateAccount.css';
import Http from '../../General/Http.js';
import { NavLink, useHistory } from 'react-router-dom';
import useToastContext from '../../CustomHooks/useToastContext.jsx';
import useLoadingContext from '../../CustomHooks/useLoadingContext.jsx';


const CreateAccount = () => {

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
    const addToToastList = useToastContext();
    const showLoading = useLoadingContext();
    const history = useHistory();

    const createAccount = () => {
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
        Http.Post('Api/Login/CreateAccount', { name, userName, password }).then(res => {
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
                addToToastList('success', "משתמש נוצר בהצלחה", "נא אמת את חשבונך לפני הכניסה");
                history.push('/');
            }
        });
    }

    const eventsKeyboard = (event) => {
        if (event.charCode === 13) {
            createAccount();
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
                        <h1>יצירת חשבון</h1>
                    </div>
                    <div className="login-form">
                        {/*<h3>שם משתמש</h3>*/}
                        <div className="input-container">
                            <i className="fa fa-male icon"></i>
                            <input type="text" value={name} id="name-input" ref={inputNameRef} onKeyPress={eventsKeyboard} onChange={e => setName(e.currentTarget.value)} />
                            <span className={`text-float-input ${name !== '' && "valid-input"}`}>...הכנס שם משתמש</span>
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
                                <input type="button" value="צור משתמש" id='btn-login' className="login-button" onClick={createAccount} />
                            </div>
                            {/*<br />*/}
                            <div className="links-login">
                                <NavLink to='/' className="sign-up link">התחברות</NavLink>
                                <NavLink to='/ForgetPassword' className="no-access link">שכחתי סיסמה</NavLink>
                            </div>
                        </div>
                        <label htmlFor='btn-login' className="error-msg btn-error-msg">{errorMsg}</label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;