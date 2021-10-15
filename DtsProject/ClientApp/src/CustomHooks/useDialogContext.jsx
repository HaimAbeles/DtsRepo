import { useContext } from 'react';
import DialogContext from '../Context/DialogContext';


export default function useDialogContext() {
    return useContext(DialogContext);
}