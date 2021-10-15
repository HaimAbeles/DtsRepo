import React, { useState } from 'react';
import Dialog from '../Components/Dialog/Dialog.jsx';

const DialogContext = React.createContext();
export default DialogContext;

export const DialogContextProvider = ({ children }) => {

    const [dialogContent, setDialogContent] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const manageDialog = (show, content = null) => {
        if (show) {
            setDialogContent(content);
            setShowDialog(true);
        }
        else {
            setShowDialog(show);
        }
    }

    return (
        <DialogContext.Provider value={manageDialog}>
            {children}
            <Dialog show={showDialog} content={dialogContent} closeDialog={() => setShowDialog(false)} />
        </DialogContext.Provider>
    )
}
