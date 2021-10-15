import React, { useState } from 'react';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Login from './Components/Login/Login.jsx';
import CreateAccount from './Components/CreateAccount/CreateAccount.jsx';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword.jsx';
import QueueBarbershop from './Components/QueueBarbershop/QueueBarbershop.jsx';
import LoadingContext from './Context/LoadingContext.jsx';
import { DialogContextProvider } from './Context/DialogContext.jsx';
import Loading from './Components/Loading/Loading.jsx';
import { ToastContextProvider } from './Context/ToastContext.jsx';
import './custom.css';


export default function App() {

    const [loading, setLoading] = useState(false);

    return (
        <>
            <LoadingContext.Provider value={setLoading}>
                <DialogContextProvider>
                    <ToastContextProvider>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path='/' component={Login} />
                                <Route path='/CreateAccount' component={CreateAccount} />
                                <Route path='/ForgetPassword' component={ForgetPassword} />
                                <Route path='/QueueBarbershop' component={QueueBarbershop} />
                                <Redirect to="/" />
                            </Switch>
                        </BrowserRouter>
                    </ToastContextProvider>
                </DialogContextProvider>
            </LoadingContext.Provider>
            <Loading showLoading={loading} />
        </>
);
}

