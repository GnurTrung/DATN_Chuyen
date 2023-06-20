import { VenomProviderContext } from "./useVenomConnect";
import { useContext } from "react";

export function useVenom() {
  const {
    isInitializing,
    isConnected,
    account,
    provider,
    login,
    logout,
    balance,
    isAuthenticated,
    profile,
  } = useContext(VenomProviderContext);
  return {
    isInitializing,
    isConnected,
    account,
    provider,
    login,
    logout,
    balance,
    isAuthenticated,
    profile,
  };
}
