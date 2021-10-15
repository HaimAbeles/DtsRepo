import { useContext } from 'react';
import LoadingContext from '../Context/LoadingContext.jsx';


export default function useLoadingContext() {
    return useContext(LoadingContext);
}