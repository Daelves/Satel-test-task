import { registerModal, $registeredModals } from '../shared/modals/model';
import FilterModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal';
import PhoneSelectModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/PhoneSelectModal';
import RuleModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/RuleModal';
import DownloadModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/DownloadModal';

export const testModalRegistration = () => {
  console.log('=== MODAL REGISTRATION TEST ===');

  // Проверка состояния до регистрации
  console.log('Before registration:', $registeredModals.getState());

  // Регистрация каждого модального окна отдельно с проверкой
  console.log('Registering phoneSelect modal...');
  registerModal('phoneSelect', PhoneSelectModal);
  console.log('After phoneSelect:', $registeredModals.getState());

  console.log('Registering rule modal...');
  registerModal('rule', RuleModal);
  console.log('After rule:', $registeredModals.getState());

  console.log('Registering download modal...');
  registerModal('download', DownloadModal);
  console.log('After download:', $registeredModals.getState());

  console.log('Registering filter modal...');
  registerModal('filter', FilterModal);
  console.log('After filter:', $registeredModals.getState());

  console.log('=== TEST COMPLETE ===');

  return Object.keys($registeredModals.getState()).length;
};
