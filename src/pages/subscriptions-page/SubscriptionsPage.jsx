import styles from './SubscriptionsPage.module.css';

function SubscriptionsPage() {
    return (
        <div className="container py-4">
            <h4 className="text-center fw-bold mb-3">Мои активные абонементы</h4>
            <hr />

            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <div className="card p-3" style={{ backgroundColor: '#d4edda' }}>
                        <div className="d-flex justify-content-between">
                            <span>Статус: активный</span>
                            <span>Срок действия: 03.04.2025 - 10.04.2025</span>
                        </div>
                        <h5 className="mt-2">Абонемент #000398</h5>
                        <p>Обучающийся: Самохвалов Вячеслав Дмитриевич</p>
                        <div>
                            <span className="badge bg-success me-1 p-3">1</span>
                            <span className="badge bg-success me-1 p-3">2</span>
                            <span className="badge bg-danger me-1 p-3">3</span>
                            <span className="badge bg-primary me-1 p-3">5</span>
                            <span className="badge bg-secondary me-1 p-3">6</span>
                            <span className="badge bg-secondary me-1 p-3">7</span>
                            <span className="badge bg-secondary me-1 p-3">8</span>
                            <span className="badge bg-secondary me-1 p-3">9</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card p-3" style={{ backgroundColor: '#d4edda' }}>
                        <div className="d-flex justify-content-between">
                            <span>Статус: активный</span>
                            <span>Срок действия: 03.04.2025 - 10.04.2025</span>
                        </div>
                        <h5 className="mt-2">Абонемент #000398</h5>
                        <p>Обучающийся: Самохвалов Вячеслав Дмитриевич</p>
                        <div>
                            <span className="badge bg-success me-1 p-3">1</span>
                            <span className="badge bg-success me-1 p-3">2</span>
                            <span className="badge bg-danger me-1 p-3">3</span>
                            <span className="badge bg-primary me-1 p-3">5</span>
                            <span className="badge bg-secondary me-1 p-3">6</span>
                            <span className="badge bg-secondary me-1 p-3">7</span>
                            <span className="badge bg-secondary me-1 p-3">8</span>
                            <span className="badge bg-secondary me-1 p-3">9</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3" style={{ backgroundColor: '#d4edda' }}>
                        <div className="d-flex justify-content-between">
                            <span>Статус: активный</span>
                            <span>Срок действия: 03.04.2025 - 10.04.2025</span>
                        </div>
                        <h5 className="mt-2">Абонемент #000398</h5>
                        <p>Обучающийся: Самохвалов Вячеслав Дмитриевич</p>
                        <div>
                            <span className="badge bg-success me-1 p-3">1</span>
                            <span className="badge bg-success me-1 p-3">2</span>
                            <span className="badge bg-danger me-1 p-3">3</span>
                            <span className="badge bg-primary me-1 p-3">5</span>
                            <span className="badge bg-secondary me-1 p-3">6</span>
                            <span className="badge bg-secondary me-1 p-3">7</span>
                            <span className="badge bg-secondary me-1 p-3">8</span>
                            <span className="badge bg-secondary me-1 p-3">9</span>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="text-center fw-bold mb-3">Архивные абонементы</h4>
            <hr />

            <div className="row">
                <div className="col-md-6">
                    <div className="card p-3" style={{ backgroundColor: '#dee2e6' }}>
                        <div className="d-flex justify-content-between">
                            <span>Статус: архивный</span>
                            <span>Срок действия: 03.04.2025 - 10.04.2025</span>
                        </div>
                        <h5 className="mt-2">Абонемент #000398</h5>
                        <p>Обучающийся: Самохвалов Вячеслав Дмитриевич</p>
                        <div>
                            <span className="badge bg-success me-1">1</span>
                            <span className="badge bg-success me-1">2</span>
                            <span className="badge bg-danger me-1">3</span>
                            <span className="badge bg-warning text-dark me-1">5</span>
                            <span className="badge bg-success me-1">6</span>
                            <span className="badge bg-success me-1">7</span>
                            <span className="badge bg-success me-1">8</span>
                            <span className="badge bg-success me-1">9</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3" style={{ backgroundColor: '#dee2e6' }}>
                        <div className="d-flex justify-content-between">
                            <span>Статус: архивный</span>
                            <span>Срок действия: 03.04.2025 - 10.04.2025</span>
                        </div>
                        <h5 className="mt-2">Абонемент #000398</h5>
                        <p>Обучающийся: Самохвалов Вячеслав Дмитриевич</p>
                        <div>
                            <span className="badge bg-success me-1">1</span>
                            <span className="badge bg-success me-1">2</span>
                            <span className="badge bg-danger me-1">3</span>
                            <span className="badge bg-warning text-dark me-1">5</span>
                            <span className="badge bg-success me-1">6</span>
                            <span className="badge bg-success me-1">7</span>
                            <span className="badge bg-success me-1">8</span>
                            <span className="badge bg-success me-1">9</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionsPage;