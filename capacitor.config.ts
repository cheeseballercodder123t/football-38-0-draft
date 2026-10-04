import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.footballdraft.app',
  appName: 'Tactical Draft: 38-0',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  backgroundColor: '#090d16',
};

export default config;
