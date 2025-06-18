export async function getBranches () {
    try {
        const response = await fetch('http://localhost:5000/branches/', {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}