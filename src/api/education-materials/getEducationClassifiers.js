export async function getEducationClassifiers () {
    try {
        const response = await fetch(`http://localhost:5000/education_classifiers/`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}