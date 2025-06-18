export async function getClassrooms (branchId) {
    try {
        const response = await fetch(`http://localhost:5000/classrooms/branch/${branchId}`, {
            method: 'GET',
            credentials: 'include'
        });

        return await response;

    } catch (error) {
        console.log(error);
    }
}