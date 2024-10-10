interface IApiResult {
  isSuccess: boolean;
  returnCode: number;
  validation?: Record<string, string>; // 更靈活的鍵值對表示法
}

interface IApiResultWithData<T> extends IApiResult {
  data: T;
}
