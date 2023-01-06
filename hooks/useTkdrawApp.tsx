import * as React from 'react';
import type { TkdrawApp } from '~state';

export const TkdrawContext = React.createContext<TkdrawApp>({} as TkdrawApp);

const useForceUpdate = () => {
  const [_state, setState] = React.useState(0);
  React.useEffect(() => setState(1));
};

export function useTkdrawApp() {
  const context = React.useContext(TkdrawContext);
  return context;
}

export const ContainerContext = React.createContext(
  {} as React.RefObject<HTMLDivElement>
);

export function useContainer() {
  const context = React.useContext(ContainerContext);
  useForceUpdate();
  return context;
}
