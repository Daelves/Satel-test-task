// model/callsTable.ts
import { createStore, createEvent, createEffect, sample } from 'effector';

export interface CallRecord {
  id: string;
  appealsId: string;
  startTime: Date;
  participants: string[];
  isRecording: boolean;
}

export interface CallsTableState {
  calls: CallRecord[];
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
export const updateCallsList = createEvent<CallRecord[]>(); // обновление списка звонков через WebSocket
export const updateCallData = createEvent<CallRecord>(); // обновление данных конкретного звонка

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

// Стор с состоянием таблицы
export const $callsTableState = createStore<CallsTableState>({
  calls: [],
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
  .on(changePage, (state, page) => ({
    ...state,
    page,
  }))
  .on(changePerPage, (state, perPage) => ({
    ...state,
    perPage,
    page: 1, // Сбрасываем на первую страницу при изменении количества записей на странице
  }))
  .on(changeSort, (state, { field, order }) => ({
    ...state,
    sortField: field,
    sortOrder: order,
    page: 1, // Сбрасываем на первую страницу при изменении сортировки
  }))
  .on(applyFilters, (state, filters) => ({
    ...state,
    filters,
    page: 1, // Сбрасываем на первую страницу при применении фильтров
  }))
  // Обновление списка звонков через WebSocket
  .on(updateCallsList, (state, calls) => {
    // Применяем текущие сортировки и фильтры
    let filteredCalls = [...calls];

    // Применяем фильтры
    if (state.filters) {
      Object.entries(state.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          filteredCalls = filteredCalls.filter((call) => {
            // Для каждого фильтра нужна своя логика
            if (key === 'isRecording') {
              return call.isRecording === value;
            }
            if (key === 'appealsId') {
              return call.appealsId.includes(value);
            }
            // Добавьте другие фильтры по необходимости
            return true;
          });
        }
      });
    }

    // Применяем сортировку
    if (state.sortField && state.sortOrder) {
      filteredCalls.sort((a, b) => {
        const field = state.sortField as keyof CallRecord;
        const aValue = a[field];
        const bValue = b[field];

        let result = 0;

        if (field === 'startTime') {
          result =
            new Date(aValue as Date).getTime() -
            new Date(bValue as Date).getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = aValue.localeCompare(bValue);
        }

        return state.sortOrder === 'ascend' ? result : -result;
      });
    }

    const totalCalls = filteredCalls.length;

    // Применяем пагинацию
    const startIndex = (state.page - 1) * state.perPage;
    const endIndex = startIndex + state.perPage;
    const paginatedCalls = filteredCalls.slice(startIndex, endIndex);

    return {
      ...state,
      calls: paginatedCalls,
      totalCalls,
    };
  })
  // Обновление данных конкретного звонка
  .on(updateCallData, (state, updatedCall) => {
    const callIndex = state.calls.findIndex(
      (call) => call.id === updatedCall.id
    );

    // Если звонок найден в текущем списке, обновляем его
    if (callIndex >= 0) {
      const updatedCalls = [...state.calls];
      updatedCalls[callIndex] = updatedCall;
      return {
        ...state,
        calls: updatedCalls,
      };
    }

    return state;
  });

// Запуск загрузки звонков при изменении параметров
sample({
  clock: [
    fetchCallsRequested,
    changePage,
    changePerPage,
    changeSort,
    applyFilters,
  ],
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

// Обновление информации о прослушанных звонках
import { disconnectFromCall, connectToCall } from './listeningCall';

$listenedCalls.on(connectToCall, (state, { id }) => ({
  ...state,
  [id]: {
    id,
    lastListenedAt: new Date(),
  },
}));
