import styles from './StudentCard.module.css';

export default function StudentCard({
    userId,
    fullName,
    email,
    birthday,
    gender,
    city,
    phoneNumber,
    uniqueCode,
    profilePictureUrl,
    onClick
}) {
    return (
        <div className="card mb-3 position-relative" style={{width: '700px'}}>
            {onClick && (
                <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2 text-danger"
                    aria-label="Открепить ученика"
                    style={{
                        fontSize: '1rem',
                        padding: '0.5rem',
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                    }}
                    onClick={() => onClick(userId)}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                ></button>
            )}
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={profilePictureUrl} className="img-fluid rounded-start" alt="Фото ученика"/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{fullName}</h5>
                        <p className="mb-1"><strong>Email:</strong> {email}</p>
                        <p className="mb-1"><strong>Дата рождения:</strong> {birthday}</p>
                        <p className="mb-1"><strong>Пол:</strong> {gender}</p>
                        <p className="mb-1"><strong>Город:</strong> {city}</p>
                        <p className="mb-1"><strong>Номер телефона:</strong> {phoneNumber}</p>
                        <p className="mb-1"><strong>Уникальный код:</strong> {uniqueCode}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
