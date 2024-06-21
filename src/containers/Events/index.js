import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  // Utilisation du hook useData pour récupérer les données et l'erreur
  const { data, error } = useData();

  // État local pour gérer le type d'événement sélectionné et la page courante de la pagination
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);


  
// Modification de la logique pour filtrer les événements en fonction du type sélectionné
  const events = type
    ? data?.events.filter((event) => event.type === type) // Filtrer par type si un type est sélectionné
    : data?.events; // Sinon, afficher tous les événements

// Filtrage des événements paginés en fonction de currentPage et PER_PAGE
  const filteredEvents = (events || []).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index && // Vérifier si l'index de l'événement est dans la plage de la page actuelle
      PER_PAGE * currentPage > index          // Vérifier si l'index de l'événement ne dépasse pas la page actuelle
    ) {
      return true; // Inclure l'événement dans la liste filtrée à afficher
    }
    return false; // Ne pas inclure l'événement dans la liste filtrée à afficher
  });




  // Fonction pour changer le type d'événement sélectionné et réinitialiser la pagination
  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialiser la pagination à la première page
    setType(evtType); // Mettre à jour le type d'événement sélectionné
  };

  // Calcul du nombre total de pages basé sur le nombre d'événements filtrés par page
  const pageNumber = Math.floor((events?.length || 0) / PER_PAGE) + 1;

  // Création d'un ensemble de types d'événements uniques à partir des données disponibles
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>} {/* Afficher un message d'erreur si une erreur est présente */}
      {data === null ? ( // Afficher "loading" si les données sont en cours de chargement
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          {/* Sélecteur pour choisir le type d'événement à afficher */}
          <Select
            selection={Array.from(typeList)} // Passer la liste des types d'événements à afficher dans le sélecteur
            onChange={(value) => (value ? changeType(value) : changeType(null))} // Appeler changeType lorsqu'un type est sélectionné
          />
          {/* Conteneur pour afficher les événements filtrés */}
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              // Utilisation du composant Modal pour encapsuler chaque carte d'événement
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {/* Utilisation de la fonction rendue par le composant Modal pour gérer l'état d'ouverture */}
                {({ setIsOpened }) => (
                  // Affichage de chaque carte d'événement avec les détails appropriés
                  <EventCard
                    onClick={() => setIsOpened(true)} // Gestion de l'ouverture du modal au clic sur la carte
                    imageSrc={event.cover} // Source de l'image de l'événement
                    title={event.title} // Titre de l'événement
                    date={new Date(event.date)} // Date de l'événement convertie en objet Date
                    label={event.type} // Type de l'événement
                  />
                )}
              </Modal>
            ))}
          </div>
          {/* Pagination pour naviguer entre les pages d'événements */}
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // Création des liens de pagination avec un clic pour changer la page affichée
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1} {/* Afficher le numéro de la page */}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;