import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAccountStore } from '@/stores/account';
import { navigate } from '@/utils/navigate';

export const API_URL = 'https://dev.api.dutying.net';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        try {
          // refreshToken Check
          let refreshTokenValue = null;
          let refreshTokenExpires = null;

          try {
            const { refreshToken } = await CookieManager.get(API_URL);
            if (refreshToken) {
              refreshTokenValue = refreshToken.value;
              refreshTokenExpires = refreshToken.expires;
            }
          } catch (cookieError) {
            console.warn('CookieManager failed, falling back to AsyncStorage:', cookieError);
          }

          if (!refreshTokenValue) {
            refreshTokenValue = await AsyncStorage.getItem('refresh');
            refreshTokenExpires = await AsyncStorage.getItem('refreshExpires');

            // 쿠키 매니저가 작동하는 환경이라면 쿠키 설정 시도
            const cookieManagerFailed = await AsyncStorage.getItem('cookieManagerFailed');
            if (cookieManagerFailed !== 'true' && refreshTokenValue) {
              try {
                await CookieManager.set(API_URL, {
                  name: 'refreshToken',
                  value: refreshTokenValue,
                  domain: 'api.dutying.net',
                  path: '/',
                  secure: true,
                  version: '0',
                  httpOnly: true,
                  expires: refreshTokenExpires || '',
                });
              } catch (setCookieError) {
                console.warn('Failed to set cookie, continuing with AsyncStorage:', setCookieError);
                AsyncStorage.setItem('cookieManagerFailed', 'true');
              }
            }
          }

          // refresh
          const accessToken = await refresh();
          const originalRequest = error.config;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          navigate('Login');
        }
      } else {
        if (error.response.status !== 403) {
          Toast.show({
            type: 'error',
            text1:
              error.response.data && error.response.data.message
                ? error.response.data.message
                : '서버에서 문제가 발생했습니다.',
            text2:
              error.response.data && error.response.data.message
                ? ''
                : '잠시 후 다시 시도해주세요.',
            visibilityTime: 2000,
          });
        }
        if (error.config) {
          console.log(error);

          console.log(error.config.url);
          throw error.config.url;
        }
      }
    }
    return Promise.reject(error);
  },
);

export type AccessToken = { accessToken: string };

export const refresh = async () => {
  const data = (await axios.post<AccessToken>(`${API_URL}/token/refresh`)).data;
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
  useAccountStore.getState().setState('accessToken', data.accessToken);
  return data.accessToken;
};

export default axiosInstance;
