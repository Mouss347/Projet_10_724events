// Importation des hooks useCallback et useState depuis React
import { useCallback, useState } from "react";

// Importation des types de prop (prop-types) pour la validation des propriétés
import PropTypes from "prop-types";

// Importation des composants Field, Select, et Button depuis les composants locaux
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

// Fonction qui simule une API de contact avec un délai de 500 millisecondes
const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

// Définition du composant Form qui prend onSuccess et onError comme propriétés
const Form = ({ onSuccess, onError }) => {
  // Déclaration d'un état local pour gérer l'indicateur de chargement du formulaire
  const [sending, setSending] = useState(false);

  // Fonction sendContact utilisant useCallback pour éviter la recréation de la fonction à chaque rendu
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
      setSending(true); // Active l'indicateur de chargement

      try {
        await mockContactApi(); // Attend la résolution de la promesse simulant l'appel API
        setSending(false); // Désactive l'indicateur de chargement
        onSuccess(); // Appelle la fonction onSuccess pour indiquer la réussite
      } catch (err) {
        setSending(false); // Désactive l'indicateur de chargement
        onError(err); // Appelle la fonction onError pour indiquer l'erreur
      }
    },
    [onSuccess, onError] // Dépendances de useCallback : la fonction sera recréée si onSuccess ou onError changent
  );

  // Rendu du formulaire avec les champs et le bouton de soumission
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" />
          <Field placeholder="" label="Prénom" />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field placeholder="" label="Email" />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"} 
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

// Validation des types des propriétés du composant Form
Form.propTypes = {
  onError: PropTypes.func, // onError doit être une fonction
  onSuccess: PropTypes.func, // onSuccess doit être une fonction
}

// Valeurs par défaut pour les propriétés onError et onSuccess
Form.defaultProps = {
  onError: () => null, // Par défaut, onError ne fait rien
  onSuccess: () => null, // Par défaut, onSuccess ne fait rien
}

// Exportation du composant Form comme exportation par défaut
export default Form;
