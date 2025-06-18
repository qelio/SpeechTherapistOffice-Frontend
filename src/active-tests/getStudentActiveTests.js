export async function getStudentActiveTests () {
    try {
        const response = await fetch(`http://localhost:5000/active_tests/my-tests-active`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}