export async function getTests (page, per_page) {
    try {
        const response = await fetch(`http://localhost:5000/tests/paginated?page=${page}&per_page=${per_page}`, {
            method: 'GET',
            credentials: 'include',
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}