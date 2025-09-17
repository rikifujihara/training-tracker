"use client";

import * as React from "react";

export interface DeviceInfo {
  isPWA: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasHomeIndicator: boolean;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isPWA: false,
    isIOS: false,
    isAndroid: false,
    hasHomeIndicator: false,
  });

  React.useEffect(() => {
    // Detect PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  // @ts-expect-error - iOS specific standalone property
                  (window.navigator.standalone === true);

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1);

    // Detect Android
    const isAndroid = /Android/.test(navigator.userAgent);

    // Check for home indicator (iOS devices with Face ID/notch)
    const hasHomeIndicator = isIOS && window.screen.height >= 812;

    setDeviceInfo({
      isPWA,
      isIOS,
      isAndroid,
      hasHomeIndicator,
    });
  }, []);

  return deviceInfo;
}