import styles from './SchedulePage.module.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import ruLocale from '@fullcalendar/core/locales/ru'

export default function SchedulePage() {
    return (
        <div className={styles.mainCalendar}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                nowIndicator={true}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                weekends={true}
                locale={ruLocale}
            />
        </div>
    )
}
