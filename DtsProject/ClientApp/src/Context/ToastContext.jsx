import React, { useEffect, useState, createContext } from "react";
import Toast from '../Components/Toast/Toast.jsx';
import checkIcon from '../images/TSicns_Success.png';
import dangerIcon from '../images/TSicns_Danger.png';
import infoIcon from '../images/TSicns_Info.png';
import warningIcon from '../images/TSicns_Warning.png';



const ToastContext = createContext();

export default ToastContext;

export const ToastContextProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [autoDeleteTime, setAutoDeleteTime] = useState(5000);
    const DeleteTime = autoDeleteTime;

    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(
                () => setToasts(toasts => toasts.slice(1)),
                DeleteTime
            );
            return () => clearTimeout(timer);
        }
    }, [toasts]);


    const addToToastList = (type, title, description) => {
        let toastProperties = null;
        const id = Math.floor((Math.random() * 100) + 1);
        switch (type) {
            case 'success':
                toastProperties = {
                    id,
                    title: title,
                    description: description,
                    backgroundColor: '#5cb85c',
                    icon: checkIcon
                }
                break;
            case 'danger':
                toastProperties = {
                    id,
                    title: title,
                    description: description,
                    backgroundColor: '#d9534f',
                    icon: dangerIcon
                }
                break;
            case 'info':
                toastProperties = {
                    id,
                    title: title,
                    description: description,
                    backgroundColor: '#5bc0de',
                    icon: infoIcon
                }
                break;
            case 'warning':
                toastProperties = {
                    id,
                    title: title,
                    description: description,
                    backgroundColor: '#f0ad4e',
                    icon: warningIcon
                }
                break;
            default:
                setToasts([]);
        }
        setToasts([...toasts, toastProperties]);


    }



    return (
        <ToastContext.Provider value={addToToastList}>
            {children}
            <div className="toasts-wrapper">
                <Toast
                    toastList={toasts}
                    autoDeleteTime={autoDeleteTime}
                />
            </div>
        </ToastContext.Provider>
    )
}
