import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  // console.log(data.events.events.id)
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtB.date) < new Date(evtA.date) ? -1 : 1
  );

// du plus ancien au plus récent en inversant evtB et evA

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === (byDateDesc?.length || 0) - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [byDateDesc?.length]);

  // utilisation de useEffect pour crée un avancement automatique toutes les 5 seconde 
  // si l'index atteint la derniere alors il revient a 0.
  // utilisation de clearInterval pour permettre d'areter setinterval actuel apres 5 secondes

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
{/* deplacement de cette div pour l'insérer a l'exterieur de la boucle map */}
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc?.map((event, radioIdx) => (
                <input 
                  key={event.title}
// Clé unique pour chaque bouton
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  onChange={() => setIndex(radioIdx)}
// onchange pour que les bouttons radio soient interactif 
                />
              ))}
            </div> 
          </div> 
      </div>
  );
};

export default Slider;
