import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  loadingMessage?: string;
}

/**
 * 异步请求 Hook
 * 封装 loading 状态、错误处理和防抖逻辑
 * @param requestFn 异步请求函数
 * @param options 配置选项
 */
export function useRequest<T = unknown, P extends unknown[] = unknown[]>(
  requestFn: (...args: P) => Promise<any>,
  options: UseRequestOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);

  // 使用 ref 跟踪最新的 options，避免 options 变化导致 run 函数重新创建
  // 这是解决 useEffect 依赖循环的常用模式
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const run = useCallback(async (...args: P) => {
    setLoading(true);
    setError(null);
    
    const currentOptions = optionsRef.current;

    // 可选：显示加载中的 Toast
    let toastId: string | number | undefined;
    if (currentOptions.loadingMessage) {
      toastId = toast.loading(currentOptions.loadingMessage);
    }

    try {
      const response = await requestFn(...args);
      // Axios 拦截器通常会解包数据，但如果 requestFn 返回的是 AxiosResponse，这里做个兼容
      // 假设 requestFn 使用了我们配置的 `api` 实例，它会返回 `response.data`
      
      const result = response?.data ?? response; // 如果拦截器没有解包，这里尝试解包
      
      setData(result);
      
      if (currentOptions.successMessage) {
        toast.success(currentOptions.successMessage, { id: toastId });
      } else if (toastId) {
        toast.dismiss(toastId);
      }

      if (currentOptions.onSuccess) {
        currentOptions.onSuccess(result as T);
      }
      return result;
    } catch (err: unknown) {
      setError(err);
      // 错误 Toast 已由全局 Axios 拦截器处理
      // 但我们需要关闭加载中的 Toast（如果有）
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      if (currentOptions.onError) {
        currentOptions.onError(err);
      }
      // 重新抛出错误，以便组件可以捕获
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestFn]); // 移除 options 依赖

  return {
    loading,
    data,
    error,
    run,
  };
}
