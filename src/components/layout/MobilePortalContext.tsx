import * as React from "react";

export const MobilePortalContext = React.createContext<HTMLElement | null>(null);

export function MobilePortalProvider({ 
  children, 
  container 
}: { 
  children: React.ReactNode; 
  container: HTMLElement | null;
}) {
  return (
    <MobilePortalContext.Provider value={container}>
      {children}
    </MobilePortalContext.Provider>
  );
}

export function useMobilePortal() {
  return React.useContext(MobilePortalContext);
}
