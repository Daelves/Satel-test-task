import { createStore, createEvent, createEffect, sample } from 'effector';
import { connectToCall } from './events';

export interface CallRecord {
  id: string;
  appealsId: string;
  startTime: Date;
  participants: string[];
  isRecording: boolean;
}

export interface CallsTableState {
  calls: CallRecord[];
  allCalls: CallRecord[];
  isLoading: boolean;
  error: string | null;
  totalCalls: number;
  page: number;
  perPage: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
  filters?: Record<string, any>;
}

// Сохранение информации о прослушанных звонках
export interface ListenedCallInfo {
  id: string;
  lastListenedAt: Date;
}

// События и эффекты
export const fetchCallsRequested = createEvent();
export const changePage = createEvent<number>();
export const changePerPage = createEvent<number>();
export const changeSort = createEvent<{
  field: string;
  order: 'ascend' | 'descend' | null;
}>();
export const applyFilters = createEvent<Record<string, any>>();
export const setAllCalls = createEvent<CallRecord[]>();
export const updateCallsList = createEvent<CallRecord[]>();
export const updateCallData = createEvent<CallRecord>();

// Эффект загрузки звонков с бэкенда
export const fetchCallsFx = createEffect(
  async (params: {
    page: number;
    perPage: number;
    sortField?: string;
    sortOrder?: 'ascend' | 'descend' | null;
    filters?: Record<string, any>;
  }) => {
    // Здесь будет запрос к API
    return {
      calls: [] as CallRecord[],
      totalCalls: 0,
    };
  }
);

const processCallsData = (
    allCalls: CallRecord[],
    page: number,
    perPage: number,
    sortField?: string,
    sortOrder?: 'ascend' | 'descend' | null,
    filters?: Record<string, any>
) => {
  let processedCalls = [...allCalls];

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        processedCalls = processedCalls.filter((call) => {
          // Для каждого фильтра нужна своя логика
          if (key === 'isRecording') {
            return call.isRecording === value;
          }
          if (key === 'appealsId') {
            return call.appealsId.includes(String(value));
          }
          return true;
        });
      }
    });
  }

  if (sortField && sortOrder) {
    processedCalls.sort((a, b) => {
      const field = sortField as keyof CallRecord;
      let result = 0;

      if (field === 'startTime') {
        result = a.startTime.getTime() - b.startTime.getTime();
      } else if (field === 'appealsId') {
        result = a.appealsId.localeCompare(b.appealsId);
      } else {
        const aValue = a[field];
        const bValue = b[field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          result = aValue - bValue;
        }
      }

      return sortOrder === 'ascend' ? result : -result;
    });
  }

  const totalCalls = processedCalls.length;

  // Применяем пагинацию
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedCalls = processedCalls.slice(startIndex, endIndex);

  return {
    calls: paginatedCalls,
    totalCalls,
  };
};

// Стор с состоянием таблицы
export const $callsTableState = createStore<CallsTableState>({
  calls: [],
  allCalls: [],
  isLoading: false,
  error: null,
  totalCalls: 0,
  page: 1,
  perPage: 10,
  sortField: 'startTime',
  sortOrder: 'descend',
});

// Стор с информацией о прослушанных звонках
export const $listenedCalls = createStore<Record<string, ListenedCallInfo>>({});

// Обработка событий
$callsTableState
    .on(fetchCallsFx.doneData, (state, { calls, totalCalls }) => ({
      ...state,
      calls,
      totalCalls,
      isLoading: false,
      error: null,
    }))
    .on(fetchCallsFx.fail, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: error.message,
    }))
    .on(fetchCallsFx.pending, (state, isPending) => ({
      ...state,
      isLoading: isPending,
    }))
    .on(changePage, (state, page) => {
      const { calls, totalCalls } = processCallsData(
          state.allCalls,
          page,
          state.perPage,
          state.sortField,
          state.sortOrder,
          state.filters
      );

      return {
        ...state,
        page,
        calls,
        totalCalls,
      };
    })
    .on(changePerPage, (state, perPage) => {
      const { calls, totalCalls } = processCallsData(
          state.allCalls,
          1, // Сбрасываем на первую страницу
          perPage,
          state.sortField,
          state.sortOrder,
          state.filters
      );

      return {
        ...state,
        perPage,
        page: 1, // Сбрасываем на первую страницу при изменении количества записей на странице
        calls,
        totalCalls,
      };
    })
    .on(changeSort, (state, { field, order }) => {
      const { calls, totalCalls } = processCallsData(
          state.allCalls,
          state.page,
          state.perPage,
          field,
          order,
          state.filters
      );

      return {
        ...state,
        sortField: field,
        sortOrder: order,
        calls,
        totalCalls,
      };
    })
    .on(applyFilters, (state, filters) => {
      const { calls, totalCalls } = processCallsData(
          state.allCalls,
          1, // Сбрасываем на первую страницу
          state.perPage,
          state.sortField,
          state.sortOrder,
          filters
      );

      return {
        ...state,
        filters,
        page: 1, // Сбрасываем на первую страницу при применении фильтров
        calls,
        totalCalls,
      };
    })
    // Установка всех звонков и их первичная обработка
    .on(setAllCalls, (state, allCalls) => {
      const { calls, totalCalls } = processCallsData(
          allCalls,
          state.page,
          state.perPage,
          state.sortField,
          state.sortOrder,
          state.filters
      );

      return {
        ...state,
        allCalls,
        calls,
        totalCalls,
        isLoading: false,
      };
    })
    // Обновление списка звонков через WebSocket - теперь обновляем allCalls
    .on(updateCallsList, (state, calls) => {
      // Устанавливаем все звонки и затем применяем обработку
      const { calls: processedCalls, totalCalls } = processCallsData(
          calls,
          state.page,
          state.perPage,
          state.sortField,
          state.sortOrder,
          state.filters
      );

      return {
        ...state,
        allCalls: calls, // Сохраняем полный список
        calls: processedCalls, // Отображаем обработанные данные
        totalCalls,
        isLoading: false,
      };
    })
    // Обновление данных конкретного звонка
    .on(updateCallData, (state, updatedCall) => {
      // Обновляем звонок в полном списке
      const updatedAllCalls = state.allCalls.map(call =>
          call.id === updatedCall.id ? updatedCall : call
      );

      const { calls: processedCalls, totalCalls } = processCallsData(
          updatedAllCalls,
          state.page,
          state.perPage,
          state.sortField,
          state.sortOrder,
          state.filters
      );

      return {
        ...state,
        allCalls: updatedAllCalls,
        calls: processedCalls,
        totalCalls,
      };
    });
// Запуск загрузки звонков при изменении параметров
sample({
  clock: fetchCallsRequested,
  source: $callsTableState,
  fn: (state) => ({
    page: state.page,
    perPage: state.perPage,
    sortField: state.sortField,
    sortOrder: state.sortOrder,
    filters: state.filters,
  }),
  target: fetchCallsFx,
});

$listenedCalls.on(connectToCall, (state, { id }) => ({
  ...state,
  [id]: {
    id,
    lastListenedAt: new Date(),
  },
}));
