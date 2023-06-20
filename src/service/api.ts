import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/authentication";
import { cookieSetting, setCookie } from "@/utils/cookie";
import axios from "axios";

function getCookie(name = ACCESS_TOKEN) {
  if (typeof window !== "undefined") {
    const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return v ? v[2] : null;
  }
}

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getCookie()}`,
};

let refreshTokenRequest: any = null;

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300000,
  headers: HEADERS,
});

export const setToken = (token: string) => {
  if (token) {
    HEADERS["Authorization"] = `Bearer ${token}`;
    AxiosInstance.interceptors.request.use((config) => {
      config.headers["Content-Type"] = HEADERS["Content-Type"];
      config.headers.Authorization = HEADERS.Authorization;
      return config;
    });
  }
};

async function refreshToken() {
  try {
    const refreshToken = getCookie(REFRESH_TOKEN);
    const accessToken = getCookie(ACCESS_TOKEN);
    // console.log('ACCOUNT_ADDRESS', address);
    const data = {
      accessToken,
      refreshToken,
    };
    return axios({
      method: "POST",
      url: process.env.NEXT_PUBLIC_API_URL + "/auth/refresh_token",
      data,
    });
  } catch (ex) {
    console.log(ex);
  }
}

export function refreshTokenFunc() {
  // const { response, config } = error;
  return refreshToken()
    .then((response: any) => {
      const { data } = response;
      // if (!data)
      //     return Promise.reject(error)
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expireIn = data.expires_in || 86400;
      //const config = response.config;
      if (accessToken && refreshToken) {
        //save token
        setCookie(ACCESS_TOKEN, accessToken, cookieSetting);
        setCookie(REFRESH_TOKEN, refreshToken, cookieSetting);
      }
      return response;
    })
    .catch(() => {
      return 0;
    });
}

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (response) {
      const { status } = response;
      if (status === 401 && getCookie(REFRESH_TOKEN)) {
        // 401
        // get new token
        refreshTokenRequest = refreshTokenRequest
          ? refreshTokenRequest
          : refreshTokenFunc;
        const newTokenData = await refreshTokenRequest();
        if (newTokenData.data) {
          setToken(newTokenData.data.access_token);
          config.headers = HEADERS;
          return AxiosInstance.request(config);
        }
      } else {
        return response;
      }
    } else return Promise.reject(error);
  }
);

export default AxiosInstance;
