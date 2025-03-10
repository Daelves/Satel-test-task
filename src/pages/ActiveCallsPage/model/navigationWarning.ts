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
  async (path: string) => {
    console.log(`Выполняем навигацию на: ${path}`);

    const navigate = $navigateFunction.getState();
    if (navigate) {
      navigate(path);
      console.log(`Навигация выполнена на: ${path}`);
    } else {
      console.warn('Функция навигации не найдена, используем location.href');
      window.location.href = path;
    }
    return path;
  }
);

$pendingNavigationPath
  .on(navigationRequested, (_, path) => {
    console.log(`Сохраняем путь для навигации: ${path}`);
    return path;
  })
  .reset(navigationCancelled)
  .reset(navigateToFx.done);

navigationRequested.watch((path) => {
  console.log(`Запрос на навигацию: ${path}`);
  const listeningCall = $listeningCall.getState();

  if (listeningCall) {
    const isRecording = $isRecording.getState();
    console.log(
      `Показываем предупреждение. Запись: ${isRecording ? 'активна' : 'неактивна'}`
    );

    openModal({
      key: 'navigationWarning',
      params: {
        isRecording,
        targetPath: path, // Передаем путь в модальное окно
        onConfirm: () => {
          console.log(`Подтверждение перехода на: ${path}`);
          navigationConfirmed();
        },
      },
    });
  } else {
    console.log(`Прямая навигация на: ${path}`);
    navigateToFx(path);
  }
});

navigationConfirmed.watch(() => {
  const path = $pendingNavigationPath.getState();
  console.log(`Подтверждение навигации, сохраненный путь: ${path}`);

  const listeningCall = $listeningCall.getState();
  const isRecording = $isRecording.getState();

  if (listeningCall) {
    if (isRecording) {
      console.log(`Переводим запись в фоновый режим: ${listeningCall.id}`);
      switchToBackgroundRecording(listeningCall.id);
    }

    console.log(`Отключаемся от звонка: ${listeningCall.id}`);
    disconnectCallRequested(listeningCall.id);
  }

  if (path) {
    closeModal('navigationWarning');

    setTimeout(() => {
      const currentPath = $pendingNavigationPath.getState();
      console.log(`Отложенная навигация. Текущий путь: ${currentPath || path}`);

      // На всякий случай проверяем путь еще раз
      if (currentPath || path) {
        navigateToFx(currentPath || path);
      } else {
        console.error('Ошибка: путь для навигации не найден!');
      }
    }, 500);
  } else {
    console.error('Ошибка: нет сохраненного пути для навигации!');
  }
});

navigationCancelled.watch(() => {
  console.log('Навигация отменена');
  closeModal('navigationWarning');
});
