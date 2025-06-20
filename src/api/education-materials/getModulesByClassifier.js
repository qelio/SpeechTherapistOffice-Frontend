export async function getModulesByClassifier (classifier_id) {
    try {
        const response = await fetch(`http://80.249.151.3/api/education_modules/classifier/${classifier_id}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}