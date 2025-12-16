import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const exchangeToken = async (code, appKey, secret, redirectUri) => {
    const response = await axios.post(`${BACKEND_URL}/exchange-token`, {
        code,
        app_key: appKey,
        secret: secret,
        redirect_uri: redirectUri
    });
    return response.data;
};

export const getUserInfo = async (accessToken) => {
    const response = await axios.post(`${BACKEND_URL}/user-info`, {
        access_token: accessToken
    });
    return response.data;
};

export const getVideoList = async (accessToken) => {
    const response = await axios.post(`${BACKEND_URL}/video-list`, {
        access_token: accessToken
    });
    return response.data;
};
