export async function logoutOnBackend() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,{
        method: 'POST',
        credentials: 'include'
    });
    if(!response) {
        throw new Error("Failed to log out on backend");
    }
}

export async function logoutOnFrontEnd() {
    const response = await fetch(`/api/auth/logout`,{
        method: 'POST',
        credentials: 'include'
    });
    if(!response) {
        throw new Error("Failed to log out on backend");
    }
}