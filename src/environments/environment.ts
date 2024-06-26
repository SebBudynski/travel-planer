declare var __env: any;

export const environment = {
  production: false,
  googleMapsApiKey: __env.googleMapsApiKey || ''
};