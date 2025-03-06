import { registerModal } from './model.ts';
import PhoneSelectModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/PhoneSelectModal.tsx';
import {
  DownloadModal,
  RuleModal,
} from '../../pages/ActiveCallsPage/components/ListeningCard';
import FilterModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal.tsx';

export const registerAllModals = () => {
  console.log('Registering all modals from registerAllModals');

  registerModal('phoneSelect', PhoneSelectModal);
  registerModal('rule', RuleModal);
  registerModal('download', DownloadModal);
  registerModal('filter', FilterModal);

  console.log('Registered modals:', [
    'phoneSelect',
    'rule',
    'download',
    'filter',
  ]);
};
