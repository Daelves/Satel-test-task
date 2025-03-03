import { registerModal } from './model.ts';
import FilterModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal.tsx';
import PhoneSelectModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/PhoneSelectModal.tsx';
import RuleModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/RuleModal.tsx';
import DownloadModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/DownloadModal.tsx';

export const registerAllModals = () => {
  // Модальные окна для компонента ListeningCard
  registerModal('phoneSelect', PhoneSelectModal);
  registerModal('rule', RuleModal);
  registerModal('download', DownloadModal);
  registerModal('filter', FilterModal);
};

export type ModalKeys = 'phoneSelect' | 'rule' | 'download' | 'filter';
