import styles from './Classifiers.module.css';
import {useEffect, useState} from "react";
import {getEducationClassifiers} from "../../../../api/education-materials/getEducationClassifiers";

export default function Classifiers( {showNotification} ) {

    const [educationClassifiers, setEducationClassifiers] = useState([]);

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

        getEducationClassifiers().then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                setEducationClassifiers(data);
            } else {
                showNotification(`Ошибка при получении списка классификаторов: ${data.message}`, 3000, 'error');
            }
        });
    }, []);

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Список доступных классификаторов</h1>
            <p className="mb-4">Классификаторы могут быть созданы исключительно администраторами.</p>

            {educationClassifiers.map((educationClassifier) => (
                <div className="card text-dark bg-light mb-3 w-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>Дисциплина: {educationClassifier.discipline_name}</span>
                        <span>дата создания: {formatDate(educationClassifier.created_at)}</span>
                    </div>
                    <div className="card-body">
                        <p className="card-text fw-bold">{educationClassifier.name}</p>
                    </div>
                </div>
            ))}

        </main>
    );
}