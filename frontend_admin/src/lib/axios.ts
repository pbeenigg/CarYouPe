import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// 定义统一的响应结构
interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    const res = response.data as ApiResponse;
    
    // Check if the response follows the standard format
    // If it has 'code' and 'message' (and maybe 'data'), we treat it as standard
    if (res && typeof res.code === 'number') {
       if (res.code === 200) {
         // Modify response.data to be the actual data to keep compatibility
         // BUT this is risky if components expect full response.
         // Let's adopt a strategy: 
         // If we migrate backend to standard response, frontend api calls need to change .data to .data.data?
         // NO. We can "unwrap" the data here.
         
         // If we unwrap here, then `const response = await api.get(...)`
         // response will be the AxiosResponse object, but response.data will be the INNER data.
         response.data = res.data;
         return response;
       } else {
         // Handle business error
         // console.error(`Business Error: ${res.message}`);
         // You might want to show a toast here
         // return Promise.reject(new Error(res.message || 'Error'));
         
         // Show toast for business errors
         toast.error(res.message || 'Error occurred');
         
         // For now, let's reject so catch blocks in components can handle it
         // Attach code to error object if needed
         const error = new Error(res.message || 'Error');
         (error as unknown as { code: number }).code = res.code;
         return Promise.reject(error);
       }
    }
    
    // If response doesn't match standard format (legacy APIs), return as is
    return response;
  },
  (error) => {
    // Handle HTTP errors
    if (error.response) {
       const { status, data } = error.response;
       if (status === 401) {
          // Unauthorized, clear token and redirect
          localStorage.removeItem('token');
          if (typeof window !== 'undefined') {
             window.location.href = '/login';
          }
       }
       // If backend returns standard error structure in 422/500
       if (data && data.message) {
          toast.error(data.message);
          return Promise.reject(new Error(data.message));
       }
    }
    // Generic error toast
    if (error.code !== 'ECONNABORTED' && error.message !== 'canceled' && error.code !== 'ERR_CANCELED') {
      toast.error(error.message || 'Network Error');
    }
    return Promise.reject(error);
  }
);

export default api;
