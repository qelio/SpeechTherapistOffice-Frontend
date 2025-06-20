export async function getEducationClassifiers () {
    try {
        const response = await fetch(`http://80.249.151.3/api/education_classifiers/`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}