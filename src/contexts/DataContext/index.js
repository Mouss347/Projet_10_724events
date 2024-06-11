import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  // création d'un nouvel état pour stocker la derniere entrée des données
  
  const getData = useCallback(async () => {
    try {
  // charger les données à partir de l'API
      const loadedData = await api.loadData()

  // Mise a jour de l'état 'data' avec les données chargées
      setData(loadedData);

  // Mise à jour de l'état 'last' avec la dernière entrée des données chargées
  // En prenant le dernier élément du tableau 'events' de 'loadedData'
      setLast(loadedData.events[loadedData.events.length - 1])
    
    
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
  // si data existe déja, sa veux dire que les données ont deja été charger
  // donc on ne recharge pas les données a nouveau en appelant 'getData' 
    getData();
  }, [data, getData]);
  // cette fonction sera exécutée chaque fois que 'data' ou 'getData' changent  
  return (
    <DataContext.Provider
      value={{
        data,
        error,
        last
  // ajout de last pour rendre disponible la dernière entrée des données
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
