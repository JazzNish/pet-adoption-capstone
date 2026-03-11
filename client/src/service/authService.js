const API_URL = 'http://localhost:5000/api/auth'; // Change 5000 if your server runs on a different port

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { message: "Network error occurred" };
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { message: "Network error occurred" };
    }
};

export const googleAuth = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        return { message: "Network error occurred" };
    }
};