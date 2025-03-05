import React, { useEffect } from 'react';
import ListeningCard from './ListeningCard/ListeningCard.tsx';
import { useCallDuration } from '../hooks/useCallDuration.ts';
import {
  useDownloadSimulation,
  useRecordingTimer,
} from '../hooks/useListeningCardHooks.ts';
import { resetListening } from '../model/events';
import { useDownloadModal } from '../hooks/useDownloadModal.ts';

const ListeningCallCard: React.FC = () => {
  useCallDuration();
  useRecordingTimer();
  useDownloadSimulation();
  // useDownloadModal();

  useEffect(() => {
    return () => {
      resetListening();
    };
  }, []);

  return <ListeningCard />;
};

export default ListeningCallCard;
