import { registerModal } from './model.ts';
import {
  DownloadModal,
  RuleModal,
} from '../../pages/ActiveCallsPage/components/ListeningCard';
import FilterModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal.tsx';
import SuccessRuleModal from '../../pages/ActiveCallsPage/components/ListeningCard/modals/SuccessRuleModal.tsx';

export const registerAllModals = () => {
  console.log('Registering all modals from registerAllModals');

  registerModal('rule', RuleModal);
  registerModal('download', DownloadModal);
  registerModal('filter', FilterModal);
  registerModal('successRule', SuccessRuleModal);

  console.log('Registered modals:', [
    'phoneSelect',
    'rule',
    'download',
    'filter',
    'successRule',
  ]);
};
