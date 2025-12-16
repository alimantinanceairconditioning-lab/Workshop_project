import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './slices/servicesSlice';
import contactsReducer from './slices/contactsSlice';
import projectsReducer from './slices/projectsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      services: servicesReducer,
      contacts: contactsReducer,
      projects: projectsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
