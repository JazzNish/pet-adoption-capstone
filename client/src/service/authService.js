const API_URL = 'https://pet-adoption-capstone.onrender.com/api/auth'; // Change 5000 if your server runs on a different port

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
    // Make sure your fetch URL matches your actual backend URL!
    const response = await fetch('https://pet-adoption-capstone.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    // 👇 THE FIX: If the backend sends an error (like a 403 Ban), throw the exact message!
    if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
    }

    return data;
};