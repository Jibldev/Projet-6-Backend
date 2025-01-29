import API_URL from "../config";

// Fonction d'inscription
export const signup = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        return await response.json();
    } catch (error) {
        return { error: true, message: "Erreur lors de l'inscription." };
    }
};

// Fonction de connexion
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!data.error) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
        }
        return data;
    } catch (error) {
        return { error: true, message: "Erreur lors de la connexion." };
    }
};

// Fonction de déconnexion
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
};
