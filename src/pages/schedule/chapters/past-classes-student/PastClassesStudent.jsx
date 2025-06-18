import styles from './PastClassesStudent.module.css';
import {useEffect, useState} from "react";
import {getPastLessons} from "../../../../api/schedule/getPastLessons";

export default function PastClassesStudent( {showNotification} ) {

    const [lessons, setLessons] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1
    });

    function fetchUpcomingLessons(page = 1) {
        getPastLessons(page, pagination.per_page).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setLessons(data.data);
                setPagination(data.pagination);
            } else {
                showNotification(`Ошибка при получении списка занятий: ${data.message}`, 3000, 'error');
            }
        })
    }

    useEffect(() => {
        fetchUpcomingLessons();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchUpcomingLessons(newPage);
        }
    };

    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Прошедшие занятия</h1>
            <p className="mb-4">В данном разделе вы можете видеть прошедшие (состоявшиеся) занятия.</p>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                    <tr>
                        <th>Дата</th>
                        <th className="text-center">Длительность</th>
                        <th className="text-center">Статус</th>
                        <th>Учитель</th>
                        <th className="text-center">Тип</th>
                        <th>Место проведения</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lessons.map(lesson => (
                        <tr key={lesson.lesson_id}>
                            <td className="align-middle">{new Date(lesson.lesson_date_time).toLocaleString()}</td>
                            <td className="align-middle text-center">{lesson.discipline_name}<br/>({lesson.duration} мин)</td>
                            <td className="align-middle text-center">
                                <span className={`badge 
                                    ${lesson.status === 'completed' ? 'bg-success' : ''}
                                    ${lesson.status === 'cancelled_in_time' ? 'bg-warning text-dark' : ''}
                                    ${lesson.status === 'missed' ? 'bg-danger' : ''}
                                    ${lesson.status === 'scheduled' ? 'bg-primary' : ''}
                                `}>
                                    {lesson.status === 'completed' ? 'Проведено' : ''}
                                    {lesson.status === 'cancelled_in_time' ? 'Отменено вовремя' : ''}
                                    {lesson.status === 'missed' ? 'Пропущено' : ''}
                                    {lesson.status === 'scheduled' ? 'Ожидается' : ''}
                                </span>
                            </td>
                            <td className="align-middle">
                                {lesson.teacher_full_name} {lesson.subscription_id && (
                                <>
                                    <br/>(в рамках абонемента #{String(lesson.subscription_id).padStart(6, '0')})
                                </>
                            )}
                            </td>
                            <td className="align-middle text-center">
                                {lesson.online_call_url ? 'онлайн' : 'очное'}
                            </td>
                            <td className="align-middle">
                                {lesson.online_call_url && (
                                    <a href={lesson.online_call_url}>Ссылка на онлайн-занятие</a>
                                )}
                                {!lesson.online_call_url && (
                                    <>
                                        {lesson.branch_name} ({lesson.classroom_name})
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {pagination.total_pages > 1 && (
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Назад
                            </button>
                        </li>

                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(num => (
                            <li key={num} className={`page-item ${pagination.page === num ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(num)}
                                >
                                    {num}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${pagination.page === pagination.total_pages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Вперед
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </main>
    );
}