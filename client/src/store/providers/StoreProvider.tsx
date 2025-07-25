'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, Persistor } from 'redux-persist';

import { store } from '../index';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [persistor, setPersistor] = useState<Persistor | null>(null);

  useEffect(() => {
    // Only create persistor on client side
    if (typeof window !== 'undefined') {
      const persist = persistStore(store);
      setPersistor(persist);
    }
  }, []);

  // On server side or before persistor is ready, just use Provider without PersistGate
  if (!persistor) {
    return <Provider store={store}>{children}</Provider>;
  }

  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        } 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}

export default StoreProvider;