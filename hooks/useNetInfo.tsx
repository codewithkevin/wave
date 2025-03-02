import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetInfo = () => {
  const [netInfo, setNetInfo] = useState<{
    isConnected: boolean | null;
    type?: string;
    isWifiEnabled?: boolean;
    isInternetReachable?: boolean | null;
  }>({ isConnected: null });

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setNetInfo({
        isConnected: state.isConnected,
        type: state.type,
        isWifiEnabled: state.isWifiEnabled,
        isInternetReachable: state.isInternetReachable,
      });
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo({
        isConnected: state.isConnected,
        type: state.type,
        isWifiEnabled: state.isWifiEnabled,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => unsubscribe();
  }, []);

  return netInfo;
};
