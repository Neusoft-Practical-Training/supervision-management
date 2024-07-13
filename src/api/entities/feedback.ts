import { AqiFeedbackState } from "@/common/enums";

/**
 * aqi_feedback
 */
export interface AqiFeedback {
  /**
   * AQI任务指派表ID，外键：aqi_assignment/aa_id
   */
  aa_id?: number;
  /**
   * 反馈区域详细地址
   */
  address: string;
  /**
   * 反馈日期
   */
  af_date?: string;
  /**
   * 空气质量反馈信息ID，自增主键
   */
  af_id?: number;
  /**
   * 反馈时间
   */
  af_time?: string;
  /**
   * 反馈信息描述，非必需
   */
  explain?: string;
  /**
   * 反馈区域网格ID，外键：grids/grid_id
   */
  grid_id: string;
  /**
   * 预期AQI信息，外键：aqi/aqi_id
   */
  pre_aqi_id: number;
  /**
   * 备注，非必需
   */
  remarks?: string;
  /**
   * 信息状态，枚举（默认为0:未指派，1:已指派，2:已确认）
   */
  state: AqiFeedbackState;
  /**
   * 所属公众监督员ID，外键：users/user_id
   */
  supervisor_id: number;
  [property: string]: any;
}