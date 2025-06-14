import styles from './ModularCalendar.module.css';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import ruLocale from "@fullcalendar/core/locales/ru";

export default function ModularCalendar( {showNotification} ) {
    return (
        <main className="col-lg-9 pt-3 ps-5">
            <h1>Модульный каледарь</h1>
            <p>В данном разделе вы можете видеть прошедшие и предстоящие занятия в виде удобного модульного расписания (понедельный календарь).</p>
            <div className={styles.calendarContainer}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    height="auto"
                    contentHeight="auto"
                    nowIndicator={true}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    weekends={true}
                    locale={ruLocale}
                />
            </div>
        </main>
    );
}