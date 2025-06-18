export async function getEducationModules () {
    try {
        const response = await fetch(`http://localhost:5000/education_modules/`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}