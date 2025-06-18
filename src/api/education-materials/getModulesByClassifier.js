export async function getModulesByClassifier (classifier_id) {
    try {
        const response = await fetch(`http://localhost:5000/education_modules/classifier/${classifier_id}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}