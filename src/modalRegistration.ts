import { registerModal } from './shared/modals/model';
import DownloadModal from './pages/ActiveCallsPage/components/ListeningCard/modals/DownloadModal';
import RuleModal from './pages/ActiveCallsPage/components/ListeningCard/modals/RuleModal';
import FilterModal from './pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal';
import SuccessRuleModal from './pages/ActiveCallsPage/components/ListeningCard/modals/SuccessRuleModal.tsx';

// Экспортируем функцию для явной регистрации модальных окон
export const registerModalComponents = () => {
  registerModal('download', DownloadModal);
  registerModal('rule', RuleModal);
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
