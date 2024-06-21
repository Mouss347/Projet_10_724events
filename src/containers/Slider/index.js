import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

// du plus ancien au plus récent en inversant l'ordre d'affichage

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === (byDateDesc?.length || 0) - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [byDateDesc?.length]);

  // utilisation de useEffect pour crée un avancement automatique toutes les 5 secondes 
  // Si `prevIndex` est égal à la longueur de `byDateDesc` moins 1,
  // alors on revient à l'index 0, sinon on incrémente l'index de 1.
  // utilisation de clearInterval pour stoper setinterval au cas ou le composant est retirer du dom sa ne produit aps d'erreur

  return (
    <div className="SlideCardList">
      {/* boucle map qui crée une carte pour chaque élément dans byDateDesc */}
      {byDateDesc?.map((event, idx) => ( 
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum"/>
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          ))}
{/* deplacement de la div SlideCard__paginationContainer pour l'insérer a l'exterieur de la boucle map */}
          <div className="SlideCard__paginationContainer">
{/* pagination = boulettes points */}
            <div className="SlideCard__pagination">
              {byDateDesc?.map((event, radioIdx) => (
                <input 
                  key={event.title}
// Clé unique pour chaque bouton
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  onChange={() => setIndex(radioIdx)}
// Onchange pour que les bouttons radio soient interactif 
                />
              ))}
            </div> 
          </div> 
      </div>
  );
};

export default Slider;
