import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './UpdateBook.module.css';
import BookForm from '../../components/Books/BookForm/BookForm';
import BackArrow from '../../components/BackArrow/BackArrow';
import { getBook } from '../../lib/common';
import { APP_ROUTES } from '../../utils/constants';
import { useUser } from '../../lib/customHooks';
import bookAdd from '../../images/book_add.jpg';

function UpdateBook() {
  const [book, setBook] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const { connectedUser, auth, userLoading } = useUser();
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      if (!connectedUser || !auth) {
        navigate(APP_ROUTES.SIGN_IN);
      }
    }
  }, [userLoading, connectedUser, auth, navigate]);

  useEffect(() => {
    async function fetchBookData() {
      const data = await getBook(params.id);
      if (data) {
        setBook(data);
      }
    }
    fetchBookData(); // 🔄 Ajout de l'appel à la fonction
  }, [params.id]);

  // 🔄 Fonction pour rafraîchir les données après modification
  const handleUpdate = async () => {
    try {
      const updatedData = await getBook(params.id);
      if (updatedData) {
        setBook(updatedData);
        setCreated(true); // Affiche le message de succès
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour :', error);
      // Vérifie si l'erreur est liée à une année invalide
      if (error.response && error.response.status === 500) {
        alert('Erreur : Veuillez entrer une année valide en chiffres uniquement (ex: 2024)');
      } else {
        alert('Une erreur est survenue, veuillez réessayer.');
      }
    }
  };

  return (
    <div className="content-container">
      <BackArrow />
      <div className={styles.Container}>
        {!created ? (
          <>
            <h1>Modifier votre livre</h1>
            <p>Vous pouvez modifier tous les champs sauf la note donnée</p>
            <BookForm book={book} validate={handleUpdate} />
            {/* Met à jour après modification */}
          </>
        ) : (
          <div className={styles.Created}>
            <h1>Merci!</h1>
            <p>Votre livre a bien été mis à jour</p>
            <img src={bookAdd} alt="Livre mis à jour" />
            <Link to="/" className="button">Retour à l&apos;accueil</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateBook;
