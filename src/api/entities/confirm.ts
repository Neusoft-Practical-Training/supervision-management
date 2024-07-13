/**
 * aqi_statistics
 */
export interface AqiStatistics {
  /**
   * 任务指派信息ID，外键：aqi_assignment/aa_id
   */
  aa_id?: number;
  /**
   * 地址，反馈信息所在区域详细地址
   */
  address: string;
  /**
   * 空气质量统计信息ID，自增主键
   */
  as_id?: number;
  /**
   * co级别，一氧化碳级别
   */
  co_level: number;
  /**
   * co浓度，一氧化碳浓度
   */
  co_value: number;
  /**
   * 确认空气质量ID，外键：aqi/aqi_id
   */
  confirm_aqi_id: number;
  /**
   * 确认日期
   */
  confirm_date?: string;
  /**
   * 确认时间
   */
  confirm_time?: string;
  /**
   * 网格员ID，外键：users/user_id
   */
  gm_id: number;
  /**
   * 网格区域ID，外键：grids/grid_id
   */
  grid_id: string;
  /**
   * 备注，非必需
   */
  remarks?: string;
  /**
   * so2级别，二氧化硫级别
   */
  so2_level: number;
  /**
   * so2浓度，二氧化硫浓度
   */
  so2_value: number;
  /**
   * spm级别，空气悬浮颗粒物级别
   */
  spm_level: number;
  /**
   * spm浓度，空气悬浮颗粒物浓度
   */
  spm_value: number;
  [property: string]: any;
}