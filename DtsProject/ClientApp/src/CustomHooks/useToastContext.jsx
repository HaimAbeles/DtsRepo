import { useContext } from 'react';
import ToastContext from '../Context/ToastContext.jsx';


export default function useToastContext() {
    return useContext(ToastContext);
}