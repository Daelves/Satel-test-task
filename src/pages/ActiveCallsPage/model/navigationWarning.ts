import { createDomain, createEvent, createStore } from 'effector';
import { openModal, closeModal } from '../../../shared/modals';
import { $listeningCall, disconnectCallRequested } from '../model';
import { $isRecording, switchToBackgroundRecording } from './listeningCall';

const navigationWarningDomain = createDomain('navigationWarning');

export const navigationRequested =
  navigationWarningDomain.createEvent<string>();
export const navigationCancelled = navigationWarningDomain.createEvent();
export const navigationConfirmed = navigationWarningDomain.createEvent();

export const $pendingNavigationPath = navigationWarningDomain.createStore<
  string | null
>(null);

export const $navigateFunction = createStore<((path: string) => void) | null>(
  null
);
export const setNavigateFunction = createEvent<(path: string) => void>();

$navigateFunction.on(setNavigateFunction, (_, navigate) => navigate);

export const navigateToFx = navigationWarningDomain.createEffect(
  (path: string) => {
    const navigate = $navigateFunction.getState();
    if (navigate) {
      // Используем функцию navigate из React Router
      navigate(path);
      console.log(`Navigating to: ${path} using React Router navigate`);
    } else {
      // Запасной вариант (не рекомендуется)
      console.warn(
        'No navigate function provided, using window.location as fallback'
      );
      window.location.href = path;
    }
    return path;
  }
);

$pendingNavigationPath
  .on(navigationRequested, (_, path) => path)
  .reset(navigationCancelled)
  .reset(navigationConfirmed)
  .reset(navigateToFx.done);

navigationRequested.watch((path) => {
  const listeningCall = $listeningCall.getState();

  if (listeningCall) {
    const isRecording = $isRecording.getState();

    openModal({
      key: 'navigationWarning',
      params: {
        isRecording,
        onConfirm: () => navigationConfirmed(),
      },
    });
  } else {
    // Если нет активного прослушивания, просто переходим
    navigateToFx(path);
  }
});

navigationConfirmed.watch(() => {
  const path = $pendingNavigationPath.getState();
  const listeningCall = $listeningCall.getState();
  const isRecording = $isRecording.getState();

  if (listeningCall) {
    if (isRecording) {
      switchToBackgroundRecording(listeningCall.id);
    }
    disconnectCallRequested(listeningCall.id);
  }

  if (path) {
    closeModal('navigationWarning');

    setTimeout(() => {
      navigateToFx(path);
    }, 100);
  }
});

navigationCancelled.watch(() => {
  closeModal('navigationWarning');
});
