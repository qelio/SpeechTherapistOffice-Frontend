import styles from './Disciplines.module.css';
import {useEffect, useState} from "react";
import {authFlow} from "../../../../api/auth/authFlow";
import {getTeacherDisciplines} from "../../../../api/education-materials/getTeacherDisciplines";

export default function Disciplines( {showNotification} ) {

    const [disciplines, setDisciplines] = useState([]);

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        getTeacherDisciplines().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setDisciplines(data);
            } else {
                showNotification(`Ошибка при получении списка дисциплин: ${data.message}`, 3000, 'error');
            }
        })
    }, []);

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Список доступных дисциплин</h1>
            <p className="mb-4">Дисциплины могут быть созданы исключительно администраторами.</p>

            {disciplines.map((discipline) => (
                <div className="card text-white bg-secondary mb-3 w-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{discipline.name}</span>
                        <span className="fw-bold">дата создания: {formatDate(discipline.created_at)}</span>
                    </div>
                    <div className="card-body">
                        <p className="card-text">Описание: {discipline.description}</p>
                        <p className="card-text">Преподаватели:
                            {discipline.teachers.map((teacher) => (
                                `👤${teacher.full_name} `
                            ))}
                        </p>
                    </div>
                </div>
            ))}

        </main>
    );
}