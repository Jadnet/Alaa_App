import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taysir.credit',
  appName: 'Taysir',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;