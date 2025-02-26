import React, { useEffect } from 'react';
import ListeningCard from "./ListeningCard/ListeningCard.tsx";
import {resetListening} from "../model/listening-card.ts";

const ListeningCallCard: React.FC = () => {
  useEffect(() => {
    return () => {
      resetListening();
    };
  }, []);

  return <ListeningCard />;
};

export default ListeningCallCard;
