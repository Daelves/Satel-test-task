import React, { useEffect } from 'react';
import ListeningCard from './ListeningCard/ListeningCard.tsx';
import { useCallDuration } from '../hooks/useCallDuration.ts';
import { useRecordingTimer } from '../hooks/useListeningCardHooks.ts';
import {resetListening} from "../model/listeningCall.ts";

const ListeningCallCard: React.FC = () => {
  useCallDuration();
  useRecordingTimer();

  useEffect(() => {
    return () => {
      resetListening();
    };
  }, []);

  return <ListeningCard />;
};

export default ListeningCallCard;
