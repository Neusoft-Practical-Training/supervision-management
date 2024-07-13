/**
 * result
 */
export interface Result<T> {
  /**
   * 响应码
   */
  code: number;
  /**
   * 响应数据
   */
  data: T;
  /**
   * 响应信息
   */
  message?: string;
  [property: string]: any;
}