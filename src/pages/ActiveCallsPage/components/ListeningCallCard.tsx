import React, { useEffect } from 'react';
import ListeningCard from './ListeningCard/ListeningCard.tsx';
import { useDownloadSimulation } from '../hooks/useListeningCardHooks.ts';
import { resetListening } from '../model/events';

const ListeningCallCard: React.FC = () => {
  useDownloadSimulation();

  useEffect(() => {
    return () => {
      resetListening();
    };
  }, []);

  return <ListeningCard />;
};

export default ListeningCallCard;
