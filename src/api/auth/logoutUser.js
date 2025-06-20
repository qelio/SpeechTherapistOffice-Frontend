import {getCookie} from "../../utils/cookies";
import {useNavigate} from "react-router-dom";

export async function logoutUser () {
    try {
        const response = await fetch('http://80.249.151.3/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Произошла ошибка при выходе из аккаунта');
            return false;
        }

    } catch (error) {
        console.error('Ошибка при выходе из аккаунта:', error);
        return null;
    }
}
