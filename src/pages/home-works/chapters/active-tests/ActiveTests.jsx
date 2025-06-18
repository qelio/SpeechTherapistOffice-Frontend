import styles from './ActiveTests.module.css';
import {useEffect, useState} from "react";
import {authFlow} from "../../../../api/auth/authFlow";
import {getStudentActiveTests} from "../../../../active-tests/getStudentActiveTests";


export default function ActiveTests( {showNotification, setActiveTestId} ) {

    const [activeTests, setActiveTests] = useState([]);

    function fetchActiveTests() {
        getStudentActiveTests().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setActiveTests(data);
            } else {
                showNotification(`Ошибка при получении списка активных тестов: ${data.message}`, 3000, 'error');
            }
        })
    }

    function handleStartActiveTest(activeTestId) {
        setActiveTestId(activeTestId);
    }

    useEffect(() => {
        fetchActiveTests();
    }, []);

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Активные тесты</h1>
            <p className="mb-4">В данном разделе вы можете видеть свои активные тесты.</p>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th>Название теста</th>
                        <th className="text-center">Тип</th>
                        <th className="text-center">Количество заданий</th>
                        <th className="text-center">Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activeTests.map(activeTest => (
                        <tr key={activeTest.lesson_id}>
                            <td className="align-middle">{activeTest.test_name}</td>
                            <td className="align-middle text-center">р/п</td>
                            <td className="align-middle text-center">{activeTest.total_exercises}</td>
                            <td className="align-middle text-center">
                                <button type="button"
                                        className="btn btn-outline-success"
                                        onClick={() => {handleStartActiveTest(activeTest.active_id)}}
                                >Начать выполнение</button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}