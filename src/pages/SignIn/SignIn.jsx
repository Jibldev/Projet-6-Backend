import React, { useState } from 'react';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../../utils/constants';
import { useUser } from '../../lib/customHooks';
import { storeInLocalStorage } from '../../lib/common';
import { ReactComponent as Logo } from '../../images/Logo.svg';
import { login, signup } from "../../lib/auth";  // Importation des fonctions d'authentification
import styles from './SignIn.module.css';

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();

  // Si l'utilisateur est déjà connecté, on redirige vers l'accueil
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, message: '' });

  // Fonction de connexion
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await login(email, password);

      if (result.error) {
        setNotification({ error: true, message: result.message });
      } else {
        storeInLocalStorage(result.token, result.userId);
        setUser(result);  // Met à jour l'état utilisateur
        navigate('/');  // Redirige vers l'accueil
      }
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      setNotification({ error: true, message: "Une erreur est survenue." });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const result = await signup(email, password);

      if (result.error) {
        setNotification({ error: true, message: result.message });
      } else {
        setNotification({ error: false, message: "Votre compte a bien été créé, vous pouvez vous connecter." });
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription :', err);
      setNotification({ error: true, message: "Une erreur est survenue." });
    } finally {
      setIsLoading(false);
    }
  };

  const errorClass = notification.error ? styles.Error : null;

  return (
    <div className={`${styles.SignIn} container`}>
      <Logo />
      <div className={`${styles.Notification} ${errorClass}`}>
        {notification.message.length > 0 && <p>{notification.message}</p>}
      </div>
      <div className={styles.Form}>
        <label htmlFor="email">
          <p>Adresse email</p>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className={styles.Submit}>
          <button
            type="submit"
            className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800 text-white hover:bg-gray-700"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <span>Chargement...</span> : "Se connecter"}
          </button>
          <span>OU</span>
          <button
            type="submit"
            className="flex justify-center p-2 rounded-md w-1/2 self-center bg-gray-800 text-white hover:bg-gray-700"
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? <span>Chargement...</span> : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default SignIn;
