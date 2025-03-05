import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';

// eslint-disable-next-line import/prefer-default-export
export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuth(authenticated);
      setUserLoading(false);
    }
    getUserDetails();
  }, []);

  return { connectedUser, auth, userLoading };
}

export function useBestRatedBooks(currentBookId) {
  const [bestRatedBooks, setBestRatedBooks] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    async function getRatedBooks() {
      try {
        const url = `${API_URL}/api/top-books/${currentBookId}`;
        const response = await fetch(url);
        const books = await response.json();
        setBestRatedBooks(books);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des meilleurs livres :', error);
      }
    }

    if (currentBookId) {
      getRatedBooks();
    }
  }, [currentBookId]);

  return { bestRatedBooks };
}

export function useFilePreview(file) {
  const fileInput = file[0] ?? [];
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (file && file[0]?.length > 0) {
      const newUrl = URL.createObjectURL(file[0][0]);

      if (newUrl !== imgSrc) {
        setImgSrc(newUrl);
      }
    }
  }, [fileInput[0]?.name]);

  return [imgSrc, setImgSrc];
}
