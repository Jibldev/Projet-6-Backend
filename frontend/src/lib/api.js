import axios from 'axios';
import { API_ROUTES } from '../utils/constants';

// Fonction pour ajouter un livre
export const addBook = async (bookData) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token de l'utilisateur
    if (!token) {
      return { error: true, message: 'Utilisateur non authentifié' };
    }

    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('year', bookData.year);
    formData.append('genre', bookData.genre);
    formData.append('rating', bookData.rating);
    formData.append('image', bookData.file[0]); // Ajoute l'image du livre

    const response = await axios.post(API_ROUTES.ADD_BOOK, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Retourne le livre ajouté
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre :", error);
    return { error: true, message: error.response?.data?.message || 'Erreur serveur' };
  }
};
