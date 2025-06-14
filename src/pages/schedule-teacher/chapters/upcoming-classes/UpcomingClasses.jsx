import styles from './UpcomingClasses.module.css';

export default function UpcomingClasses( {showNotification} ) {
    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Предстоящие занятия</h1>
            <p className="mb-4">В данном разделе вы можете видеть предстоящие (не состоявшиеся) занятия.</p>

        </main>
    );
}