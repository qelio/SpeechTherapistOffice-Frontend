export async function getPastLessons (page, per_page) {
    try {
        const response = await fetch(`http://80.249.151.3/api/lessons/past?page=${page}&per_page=${per_page}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}