import { TaskCompletedState } from "@/common/enums";

/**
 * aqi_assignment
 */
export interface AqiAssignment {
  /**
   * 空气质量监测任务ID，自增主键
   */
  aa_id: number;
  /**
   * 任务区域详细地址
   */
  address: string;
  /**
   * 指派任务管理员ID，外键：users/user_id
   */
  admin_id: number;
  /**
   * 空气质量反馈信息ID，外键：aqi_feedback/af_id
   */
  af_id: number;
  /**
   * 空气质量统计信息ID，外键：aqi_statistics/as_id
   */
  as_id?: number;
  /**
   * 指派日期
   */
  assign_date?: string;
  /**
   * 指派时间
   */
  assign_time?: string;
  /**
   * 完成状态，枚举（默认为0：未完成，1：已完成，2：跨域请求中，3：跨域请求拒绝，4：跨域已受理，5：跨域任务完成）
   */
  completed: TaskCompletedState;
  /**
   * 是否跨域，布尔类型（默认为0:未跨域，1:跨域）
   */
  cross_domain: boolean;
  /**
   * 指定网格员ID，外键：users/user_id（如果跨域，则由对方区域管理员指定网格员）
   */
  gm_id?: number;
  /**
   * 任务区域网格ID，外键：grids/grid_id
   */
  grid_id: string;
  /**
   * 备注，非必需
   */
  remarks?: string;
  /**
   * 反馈信息公众监督员ID，外键：users/user_id
   */
  supervisor_id: number;
  [property: string]: any;
}