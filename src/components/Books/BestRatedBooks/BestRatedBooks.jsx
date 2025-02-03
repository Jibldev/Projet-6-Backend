import React from 'react';
import PropTypes from 'prop-types';
import { useBestRatedBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './BestRatedBooks.module.css';

function BestRatedBooks({ currentBookId }) {
  console.log('📌 currentBookId reçu :', currentBookId);

  const { bestRatedBooks } = useBestRatedBooks(currentBookId);

  console.log('📌 Livres récupérés depuis l"API :', bestRatedBooks);

  const bestRatedBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.map((elt) => (
      // eslint-disable-next-line no-underscore-dangle
      <BookItem key={`book-${elt._id}`} book={elt} size={3} />
    ))
  ) : <h3>Aucune recommandation</h3>;

  return (
    <section className={`content-container ${styles.BestRatedBooks}`}>
      <h2>Les mieux notés</h2>
      <div className={styles.List}>
        {bestRatedBooksContent}
      </div>
    </section>
  );
}

BestRatedBooks.propTypes = {
  currentBookId: PropTypes.string.isRequired, // L'ID du livre doit être une string et obligatoire
};

export default BestRatedBooks;
