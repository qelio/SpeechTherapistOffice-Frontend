export async function getBranches () {
    try {
        const response = await fetch('http://80.249.151.3/api/branches/', {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}