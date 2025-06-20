export async function getClassrooms (branchId) {
    try {
        const response = await fetch(`http://80.249.151.3/api/classrooms/branch/${branchId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}