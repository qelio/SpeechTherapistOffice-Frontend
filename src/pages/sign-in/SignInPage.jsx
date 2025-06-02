import {useContext, useEffect, useState} from 'react';
import styles from './SignInPage.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {authFlow} from "../../api/auth/authFlow";
import {useNavigate} from "react-router-dom";
import ButtonFullWidth from "../../components/buttons/button-full-width/ButtonFullWidth";


function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Ошибка входа');
                return;
            }

            navigate('/');

        } catch (err) {
            setError('Ошибка подключения к серверу');
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const userId = await authFlow();
            if (userId) {
                navigate('/');
            } else {
                setIsLoading(false);
            }
        };
        verifyAuth().then();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 className="text-center mb-3">Вход в аккаунт</h1>
                <p className="text-center mb-5">Пожалуйста, войдите в аккаунт, чтобы получить доступ к личному кабинету.</p>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Адрес электронной почты</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@mail.ru"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Введите адрес электронной почты, который указали при регистрации.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <a href="#" className="mt-5">
                        Забыли пароль?
                    </a>
                    <ButtonFullWidth buttonText="Войти в аккаунт" onClick={handleSubmit}/>

                </Form>
            </div>
        </div>
    );
}

export default SignInPage;
