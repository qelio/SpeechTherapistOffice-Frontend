import { useEffect } from 'react';
import {authFlow} from "../api/auth/authFlow";


export const useAuthInterval = () => {
    useEffect(() => {
        authFlow();

        const intervalId = setInterval(authFlow, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);
};