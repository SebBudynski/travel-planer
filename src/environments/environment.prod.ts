declare var __env: any;

export const environment = {
  production: true,
  googleMapsApiKey: __env.googleMapsApiKey || ''
};