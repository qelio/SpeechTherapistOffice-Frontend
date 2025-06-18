import styles from './PastClasses.module.css';
import {useEffect, useState} from "react";
import {getPastLessons} from "../../../../api/schedule/getPastLessons";
import {cancelLesson} from "../../../../api/schedule/cancelLesson";
import {missLesson} from "../../../../api/schedule/missLesson";
import {deleteLesson} from "../../../../api/schedule/deleteLesson";
import {deleteSaveLesson} from "../../../../api/schedule/deleteSaveLesson";

export default function PastClasses( {showNotification} ) {

    const [lessons, setLessons] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 1
    });

    function handleCancelClick(lessonId) {
        cancelLesson(lessonId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Статус занятия изменен на "отменено"!`, 3000, 'success');
                fetchUpcomingLessons();
            } else {
                showNotification(`Ошибка при отмене занятия: ${data.message}`, 3000, 'error');
            }
        });
    }

    function handleMissedClick(lessonId) {
        missLesson(lessonId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                showNotification(`Статус занятия изменен на "пропущено"!`, 3000, 'success');
                fetchUpcomingLessons();
            } else {
                showNotification(`Ошибка при пропуске занятия: ${data.message}`, 3000, 'error');
            }
        });
    }
    function handleDeleteClick(lessonId) {
        deleteSaveLesson(lessonId).then(async (response) => {
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                showNotification(`Занятие успешно удалено (занятие в абонементе восстановлено)!`, 3000, 'success');
                fetchUpcomingLessons();
            } else {
                showNotification(`Ошибка при удалении занятия: ${data.message}`, 3000, 'error');
            }
        });
    }

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
                        <th>Ученик</th>
                        <th className="text-center">Тип</th>
                        <th>Место проведения</th>
                        <th className="text-center">Действия</th>
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
                                {lesson.student_full_name} {lesson.subscription_id && (
                                <>
                                    (абонемент #{String(lesson.subscription_id).padStart(6, '0')})
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
                            <td className="align-middle text-center">
                                {lesson.status === 'completed' && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary w-100 mb-2"
                                            style={{ fontSize: '10pt' }}
                                            onClick={() => handleCancelClick(lesson.lesson_id)}
                                        >Отменено вовремя</button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-warning w-100 mb-2"
                                            style={{ fontSize: '10pt' }}
                                            onClick={() => handleMissedClick(lesson.lesson_id)}
                                        >Пропущено</button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 mb-2"
                                    style={{ fontSize: '10pt' }}
                                    onClick={() => handleDeleteClick(lesson.lesson_id)}
                                >Удалить</button>



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