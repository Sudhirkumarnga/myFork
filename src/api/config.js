export const defaultConfig = {
    API_URL: 'https://smart-workhorse-33965.botics.co/',
};

export const App = {
    config: defaultConfig,
};

window.env = window.env || defaultConfig;
App.config = { ...window.env };

export const API_URL = () => App.config.API_URL;
