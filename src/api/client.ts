import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import axios, { type AxiosError } from 'axios';
import Toast from 'react-native-toast-message';
import { useAccountStore } from '@/stores/account';
import { navigateToLoginAndResetHistory } from '@/utils/navigate';

export const API_URL = 'https://api.dutying.net';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 설정
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    console.error('네트워크 오류:', error.request);

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
                await AsyncStorage.setItem('cookieManagerFailed', 'true');
              }
            }
          }

          // refresh token이 없으면 로그인 페이지로 이동
          if (!refreshTokenValue) {
            navigateToLoginAndResetHistory();
            return Promise.reject(error);
          }

          // refresh
          const accessToken = await refresh();
          const originalRequest = error.config;
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          }
          return Promise.reject(error);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          navigateToLoginAndResetHistory();
          return Promise.reject(refreshError);
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
          console.log('API 오류:', error.message, error.response?.status);
          console.log('요청 URL:', error.config.url);
        }
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우 (네트워크 오류)
      Toast.show({
        type: 'error',
        text1: '네트워크 연결을 확인해주세요.',
        text2: '인터넷 연결이 불안정합니다.',
        visibilityTime: 2000,
      });
    } else {
      // 요청 설정 중 에러가 발생한 경우
      Toast.show({
        type: 'error',
        text1: '요청 처리 중 오류가 발생했습니다.',
        visibilityTime: 2000,
      });
    }
    return Promise.reject(error);
  },
);

export type AccessToken = { accessToken: string };

export const refresh = async () => {
  try {
    const data = (await axios.post<AccessToken>(`${API_URL}/token/refresh`)).data;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    useAccountStore.getState().setState('accessToken', data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error('토큰 갱신 중 오류:', error);
    throw error;
  }
};

export default axiosInstance;
