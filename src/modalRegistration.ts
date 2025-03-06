import { registerModal } from './shared/modals/model';
import DownloadModal from './pages/ActiveCallsPage/components/ListeningCard/modals/DownloadModal';
import PhoneSelectModal from './pages/ActiveCallsPage/components/ListeningCard/modals/PhoneSelectModal';
import RuleModal from './pages/ActiveCallsPage/components/ListeningCard/modals/RuleModal';
import FilterModal from './pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal';

// Экспортируем функцию для явной регистрации модальных окон
export const registerModalComponents = () => {
  console.log('Explicitly registering modals...');
  registerModal('download', DownloadModal);
  registerModal('phoneSelect', PhoneSelectModal);
  registerModal('rule', RuleModal);
  registerModal('filter', FilterModal);
  console.log('Modals registered');
};
