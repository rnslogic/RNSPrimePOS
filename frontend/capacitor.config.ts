import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.posprime.app',
  appName: 'RNSPrimePOS',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
    },
    CapacitorUpdater: {
      autoUpdate: false, // We handle manual checking/downloading logic in App.vue
      resetWhenUpdate: false
    }
  }
};

export default config;
