import API_URL from '../config';

// Fonction d'inscription avec gestion des erreurs
export const signup = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Vérifie si l'API a renvoyé une erreur
    if (!response.ok) {
      console.error('❌ Erreur d\'inscription :', data);

      // Récupère tous les messages d'erreur dans un tableau
      const errorMessage = data.details
        ? data.details.map((err) => err.msg).join(', ') // Concatène les erreurs
        : data.message; // Si pas de détails, utilise le message général

      return { error: true, message: errorMessage };
    }

    return data;
  } catch (error) {
    console.error('❌ Erreur réseau lors de l\'inscription:', error.message);
    return { error: true, message: "Erreur lors de l'inscription." };
  }
};

// Fonction de connexion
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!data.token) {
      return { error: true, message: data.message || 'Erreur inconnue' };
    }
    return data;
  } catch (error) {
    console.error('🚨 Erreur lors de la connexion :', error);
    return { error: true, message: 'Erreur lors de la connexion.' };
  }
};

// Fonction de déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};
