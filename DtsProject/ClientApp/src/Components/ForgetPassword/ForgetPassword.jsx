import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Http from '../../General/Http.js';
import './ForgetPassword.css';
import useToastContext from '../../CustomHooks/useToastContext.jsx';
import useLoadingContext from '../../CustomHooks/useLoadingContext.jsx';
import useDialogContext from '../../CustomHooks/useDialogContext.jsx';


const ForgetPassword = () => {

    const [userName, setUserName] = useState('');
    const [verification, setVerification] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorMsgInput, setErrorMsgInput] = useState('');
    const [statusReset, setStatusReset] = useState('forgetPassword');
    const inputRef = useRef();
    const addToToastList = useToastContext();
    const history = useHistory();
    const showLoading = useLoadingContext();
    const manageDialog = useDialogContext();
    
    const forgetPassword = () => {
        setErrorMsg('');
        let isValidateEmail = true;
        if (userName === '') {
            setErrorMsgInput("נא להזין שם משתמש");
            isValidateEmail = false;
        }
        const regularEmail = /^\S+@\S+\.\S+$/;
        if (!regularEmail.test(userName) && isValidateEmail) {
            setErrorMsgInput('כתובת מייל לא תקינה');
            isValidateEmail = false;
        }
        isValidateEmail && setErrorMsgInput('');
        debugger
        if (!isValidateEmail) {
            inputRef.current.focus();
            return;
        }
        showLoading(true);
        Http.Get(`api/Login/ForgetPassword`, { email: userName }).then(res => {
            showLoading(false);
            if (!res.ok) {
                res.text()
                    .then(error => {
                        setErrorMsg(JSON.parse(error));
                        addToToastList('warning', JSON.parse(error));
                        setUserName('');
                        inputRef.current.focus();
                    });
            }
            else {
                res.json()
                    .then(isSendMail => {
                        if (isSendMail) {
                            setStatusReset('verificationPasswordReset');
                            addToToastList('info', 'קוד אימות נשלח לחשבונך', 'הקוד תקף לחמש דקות');
                        }
                        else {
                            addToToastList('danger', "משתמש לא קיים במערכת");
                        }
                    })
            }
        })
    }

    const verificationPasswordReset = () => {
        if (verification.length !== 6) {
            setErrorMsgInput("קוד האימות אינו תקין");
            return;
        }
        else {
            showLoading(true);
            Http.Get(`api/Login/VerificationPasswordReset/${userName}?verificationCode=${verification}`).then(res => {
                showLoading(false);
                if (!res.ok)
                    res.text()
                        .then(error => {
                            setErrorMsg(JSON.parse(error));
                            addToToastList('warning', JSON.parse(error));
                            setVerification('');
                            inputRef.current.focus();
                        })
                else {
                    res.json()
                        .then(isAuth => { 
                            if (isAuth) {
                                setStatusReset('saveNewPassword');
                                addToToastList('info', 'קוד אימות תקין', 'בחר סיסמה חדשה');
                            }
                            else {
                                const bodyDialog =  <>
                                                        <div>קוד אימות אינו בתוקף</div>
                                                        <div>אנא התחל מחדש את תהליך איפוס הסיסמה</div>
                                                        <button onClick={() => manageDialog(false)}>אישור</button>
                                                    </>;
                                
                                addToToastList('warning', 'קוד האימות תקף רק לחמש דקות');
                                setStatusReset('forgetPassword');
                                setVerification('');
                                manageDialog(true, bodyDialog);
                            }
                        })
                }
            })
        }

    }

    const saveNewPassword = () => {
        let isValidatePassword = true;
        if (newPassword === '') {
            setErrorMsgInput('נא להזין סיסמה');
            isValidatePassword = false;
        }
        const regulerPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regulerPassword.test(newPassword) && isValidatePassword) {
            setErrorMsgInput("סיסמה צריכה להכיל לפחות 8 תוים, אות קטנה, גדולה, מספר, תו מיוחד");
            isValidatePassword = false;
        }
        isValidatePassword && setErrorMsgInput('');

        if (!isValidatePassword) {
            inputRef.current.focus();
            return;
        }
        showLoading(true);
        Http.Get(`api/Login/SaveNewPassword/${userName}?newPassword=${newPassword}`).then(res => {
            showLoading(false);
            if (!res.ok)
                res.text()
                    .then(error => {
                        setErrorMsg(JSON.parse(error));
                        addToToastList('warning', JSON.parse(error));
                        setNewPassword('');
                        inputRef.current.focus();
                    })
            else {
                addToToastList('success', "סיסמה נשמרה בהצלחה");
                history.push('/');
            }
        })
    }

    const eventsKeyboard = (event) => {
        if (event.charCode === 13) {
            statusReset === 'forgetPassword' ? forgetPassword() : statusReset === 'verificationPasswordReset' ? verificationPasswordReset() : saveNewPassword();
        }

        if (event.getModifierState('CapsLock'))
            setErrorMsg('דולק CapsLock');
        else
            setErrorMsg('');
    }

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
            <>
            <div className="login-root">
                <div className="container-logo">
                    <div className="logo"></div>
                </div>
                <div className="login">
                    <div className="login-header">
                        <h1>{statusReset === 'forgetPassword' ? 'איפוס סיסמה' : statusReset === 'verificationPasswordReset' ? 'אימות משתמש' : statusReset === "saveNewPassword" && 'סיסמה חדשה'}</h1>
                    </div>
                    <div className="login-form">
                        <div className="input-container">
                            <i className={statusReset === 'forgetPassword' ? "fa fa-envelope icon" : statusReset === 'verificationPasswordReset' ? "fa fa-lock icon" : "fa fa-key icon"}></i>
                            <input type={statusReset === "saveNewPassword" ? "password" : statusReset === "verificationPasswordReset" ? "number" : statusReset === "forgetPassword" && "email"} value={statusReset === 'forgetPassword' ? userName : statusReset === 'verificationPasswordReset' ? verification : statusReset === "saveNewPassword" && newPassword} id="email-input" ref={inputRef} onKeyPress={eventsKeyboard} onChange={e => statusReset === 'forgetPassword' ? setUserName(e.currentTarget.value) : statusReset === 'verificationPasswordReset' ? setVerification(e.currentTarget.value) : statusReset === "saveNewPassword" && setNewPassword(e.currentTarget.value)} />
                            <span className={`text-float-input ${statusReset === "saveNewPassword" && newPassword !== '' ? "valid-input" : statusReset === "verificationPasswordReset" && verification !== '' ? "valid-input" : statusReset === "forgetPassword" && userName !== '' && "valid-input"}`}>{statusReset === 'forgetPassword' ? '...הכנס כתובת מייל' : statusReset === 'verificationPasswordReset' ? '...הכנס קוד אימות' : statusReset === "saveNewPassword" && '...הזן סיסמה חדשה'}</span>
                            <label htmlFor='email-input' className="error-msg">{errorMsgInput}</label>
                        </div>
                        {/*<br />*/}
                        <div className="futur-login">
                            <div className="container-btn-login">
                                <input type="button" value={statusReset === 'forgetPassword' ? 'אפס סיסמה' : statusReset === 'verificationPasswordReset' ? 'אמת משתמש' : statusReset === "saveNewPassword" && 'שמור סיסמה'} id='btn-login' className="login-button" onClick={statusReset === 'forgetPassword' ? forgetPassword : statusReset === 'verificationPasswordReset' ? verificationPasswordReset : statusReset === "saveNewPassword" && saveNewPassword} />
                            </div>
                            {/*<br />*/}
                            <div className="links-login">
                                <NavLink to='/' className="sign-up link">התחברות</NavLink>
                                <NavLink to='/CreateAccount' className="sign-up link" style={{ borderBottom: '0px', padding: '0px' }}>משתמש חדש</NavLink>
                            </div>
                        </div>
                        <label htmlFor='btn-login' className="error-msg btn-error-msg">{errorMsg}</label>
                    </div>
                </div>
            </div>
            </>
        );
}

export default ForgetPassword;