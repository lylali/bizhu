import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

// API 响应统一格式
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: Record<string, any>;
}

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器：自动添加 JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理统一格式和错误
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { success, data, error } = response.data;

    if (success && data) {
      return Promise.resolve(data);
    }

    if (!success && error) {
      return Promise.reject({
        code: error.code,
        message: error.message,
        status: response.status,
      });
    }

    return Promise.reject({
      code: 'UNKNOWN_ERROR',
      message: '未知错误',
      status: response.status,
    });
  },
  (error) => {
    // 401 未授权：重定向到登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // 注意：这里不能直接调用 useNavigate，需要在应用级别处理
      // 可以通过事件或全局状态管理处理
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject({
      code: error.response?.data?.error?.code || 'REQUEST_ERROR',
      message: error.response?.data?.error?.message || error.message || '请求失败',
      status: error.response?.status,
    });
  }
);

/**
 * 发送请求的通用函数
 * @param method HTTP 方法
 * @param url 请求 URL
 * @param data 请求数据（GET 请求为 params）
 * @param config 额外的 axios 配置
 */
export async function request<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  if (method === 'GET') {
    return axiosInstance.get<any, T>(url, {
      params: data,
      ...config,
    });
  }

  return axiosInstance(
    {
      method,
      url,
      data,
      ...config,
    }
  );
}

export default axiosInstance;
