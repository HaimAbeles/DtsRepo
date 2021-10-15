import React, { useEffect, useState } from 'react';
import Dialog from '../Dialog/Dialog.jsx';
import Http from '../../General/Http';
import './QueueBarbershop.css';
import useLoadingContext from '../../CustomHooks/useLoadingContext.jsx';
import useDialogContext from '../../CustomHooks/useDialogContext.jsx';
import { type } from 'jquery';



const QueueBarbershop = () => {

    const [refresh, setRefresh] = useState(false);
    const [queueList, setQueueList] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [dateQueue, setDateQueue] = useState(new Date().toJSON().substring(0, new Date().toJSON().indexOf('T')));
    const [timeQueue, setTimeQueue] = useState(new Date().toLocaleTimeString().padStart(8, '0'));
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const showLoading = useLoadingContext();
    const manageDialog = useDialogContext()

    const createQueue = () => {
        setShowDialog(true);
    }


    useEffect(() => {
        console.log('refresh')
        showLoading(true);
        Http.Get('api/Barbershop/GetQueueList').then(res => res.json()).then(list => setQueueList(list)).then(() => { showLoading(false) });
    }, [refresh]);

    const saveQueue = () => {
        const { name, email } = JSON.parse(sessionStorage.getItem('user'));
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const data = { uniqueId, dateTimeQueue: new Date(`${dateQueue}T${timeQueue}`), timeCreated: new Date().toJSON(), name, email };
        showLoading(true);
        Http.Post('api/Barbershop/InsertQueue', data).then(res => showLoading(false));
        console.log({ uniqueId, dateTimeQueue: new Date(`${dateQueue}T${timeQueue}`), timeCreated: new Date().toJSON(), name, email });
        setShowDialog(false);
        setTimeout(() => {
            setRefresh(!refresh);
        }, 1000)
    }

    const deleteQueue = (id) => {
        showLoading(true);
        Http.Get(`api/Barbershop/DeleteQueue/${id}`, null, "DELETE").then(res => setRefresh(!refresh));
        showLoading(false);
        manageDialog(false);
    }

    const openQueueDetails = (customerDtelails) => {
        console.log('customerDtelails', customerDtelails)
        const dateQueue = customerDtelails.dateTimeQueue.split('T');
        const dateCreated = customerDtelails.dateTimeQueue.split('T');
        const { email } = JSON.parse(sessionStorage.getItem('user'));
        const dialog =
            <>
                <div className="single-customer-popup">
                    <div className="root-dialog-queue-detials">
                        <div><span>לקוח:</span><span> {customerDtelails.name}</span></div>
                        <div><span>תאריך הגעה:</span> <span>{dateQueue[0]}, בשעה: {dateQueue[1].substring(0, dateQueue[1].length - 1)}</span></div>
                        <div><span>תאריך יצירת התור:</span><span> {dateCreated[0]}, בשעה: {dateCreated[1].substring(0, dateCreated[1].length - 1)}</span></div>
                        {
                            customerDtelails.email === email && <div className="div-btn div-delete"><button className="delete-queue" onClick={() => deleteQueue(customerDtelails.uniqueId)}>מחיקת אירוע</button></div>
                        }
                    </div>
                </div>
            </>;
        manageDialog(true, dialog);
        console.log(customerDtelails)
    }

    const bodyDialog =
        <>
            <div className="root-create-queue">
                <div className="div-date-queue">
                    <div className="text-date-queue">תאריך זימון תור</div>
                    <input type="date" className="input-date" value={dateQueue} onChange={(e) => setDateQueue(e.target.value)} />
                </div>
                <div className="div-time-queue">
                    <div className="text-time-queue">זמן הגעה</div>
                    <input type="time" className="input-time" value={timeQueue} onChange={(e) => setTimeQueue(e.target.value)} />
                </div>  
            </div>
            <div className="div-btn">
                <button className="save-btn" onClick={saveQueue}>שמור</button>
                <button className="close-btn" onClick={() => setShowDialog(false)}>סגור</button>
            </div>
        </>

    return (
        <>
            <div className="div-new-queue">
                <input type="button" className="btn-new-queue" value="יצירת תור חדש" onClick={createQueue} />
            </div>
            {
                queueList.length === 0 ? <div className="root-empty-list"><div className="text-list">אין לקוחות רשומים בתור למספרה</div></div>
                    :
                    <>
                        <div className="root-searches">
                            <div className="container-searches">
                                <input type="text" className="input" value={searchName} placeholder="סינון לפי שמות" onChange={(e) => setSearchName(e.target.value)} />
                                <input type="text" className="input" value={searchDate} placeholder="סינון לפי תאריכים YYYY-MM-DD" onChange={(e) => setSearchDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="root-list">
                            <div className="list-queue">
                                {
                                    queueList.map((singleCustomer, index) => {
                                        return ((searchName === '' || singleCustomer.name.includes(searchName)) && (searchDate === '' || singleCustomer.dateTimeQueue.substring(0, singleCustomer.dateTimeQueue.indexOf('T')).includes(searchDate))) ? <div className="single-queue" key={index} onClick={() => openQueueDetails(singleCustomer)}>
                                            <div>{singleCustomer.name}</div>
                                            <div>תאריך: {singleCustomer.dateTimeQueue.substring(0, singleCustomer.dateTimeQueue.indexOf('T'))}</div>
                                        </div>
                                            : <div>אין תוצאות לחיפוש המבוקש</div>
                                    })
                                }
                            </div>
                        </div>
                    </>
                
            }
            <Dialog content={bodyDialog} show={showDialog} closeDialog={() => setShowDialog(false)} />
        </>
        );
}

export default QueueBarbershop;