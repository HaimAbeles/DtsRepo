import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

const Toast = (props) => {

    const { toastList } = props;
    const [list, setList] = useState(toastList);
    const position = 'bottom-right';

    useEffect(() => {
        setList(toastList);
    }, [toastList, list]);


    const deleteToast = id => {
        const index = list.findIndex(e => e.id === id);
        setList(toasts => toasts.splice(index, 1));

    }
    return (
        <>
            <div className={`notification-container ${position}`}>
                {
                    list.map((toast, i) =>
                        <SingleToast toast={toast} key={i} i={i} position={position} deleteToast={deleteToast} />
                    )
                }
            </div>
        </>
    )
}

//Toast.defaultProps = {
//    position: 'bottom-right'
//}

Toast.propTypes = {
    toastList: PropTypes.array.isRequired,
    //position: PropTypes.string,
    autoDelete: PropTypes.bool,
    autoDeleteTime: PropTypes.number
}

export default Toast;

const SingleToast = ({ toast, i, position, deleteToast }) => {

    const [autoDeleteToast, setAutoDeleteToast] = useState(5);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setAutoDeleteToast(prevTime => prevTime - 1);
        }, 1000)
        return () => window.clearInterval(interval);
    }, [])

    return (
        autoDeleteToast <= 0 ? <></>
            :
            <div
                key={i}
                className={`notification toast ${position}`} style={{ backgroundColor: toast.backgroundColor }}
            >
                <button onClick={() => deleteToast(toast.id)}> X </button>
                <div className="notification-image">
                    <img src={toast.icon} alt="" />
                </div>
                <div>
                    <p className="notification-title">{toast.title}</p>
                    <p className="notification-message">{toast.description}</p>
                </div>
            {/*    <div className="continer-progress"><div className="progress-bar" style={{ width: `${(autoDeleteToast - 1) * 20}%` }}></div></div>*/}
            </div >
    );
}



//import React, { useState, useEffect } from 'react';
//import PropTypes from 'prop-types';
//import './Toast.css';

//const Toast = (props) => {

//    const { toastList, autoDeleteTime } = props;
//    const [list, setList] = useState(toastList);
//    const position = 'bottom-right';

//    useEffect(() => {
//        setList(toastList);
//    }, [toastList, list]);

//    const deleteToast = id => {
//        const index = list.findIndex(e => e.id === id);
//        setList(toasts => toasts.splice(index, 1));

//    }
//    return (
//        <>
//            <div className={`notification-container ${position}`}>
//                {
//                    list.map((toast, i) =>
//                        <div
//                            key={i}
//                            className={`notification toast ${position}`} style={{ backgroundColor: toast.backgroundColor }}>
//                            <button onClick={() => deleteToast(toast.id)}> X </button>
//                            <div className="notification-image">
//                                <img src={toast.icon} alt="" />
//                            </div>
//                            <div>
//                                <p className="notification-title">{toast.title}</p>
//                                <p className="notification-message">{toast.description}</p>
//                            </div>
//                        </div>
//                    )
//                }
//            </div>
//        </>
//    )
//}

////Toast.defaultProps = {
////    position: 'bottom-right'
////}

//Toast.propTypes = {
//    toastList: PropTypes.array.isRequired,
//    //position: PropTypes.string,
//    autoDelete: PropTypes.bool,
//    autoDeleteTime: PropTypes.number
//}

//export default Toast;