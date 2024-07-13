/**
 * aqi
 */
export interface Aqi {
  /**
   * AQI说明，空气质量指数具体说明
   */
  aqi_explain: string;
  /**
   * ID编号，主键：空气质量指数级别（共六级：0：优，1:良，2：轻度污染，3:中度污染，4:重度污染，5:严重污染）
   */
  aqi_id: number;
  /**
   * 中文说明，空气质量指数级别汉字表述
   */
  chinese_explain: string;
  /**
   * CO浓度最大值，本级别一氧化碳浓度最大值
   */
  co_max: number;
  /**
   * CO浓度最小值，本级别一氧化碳浓度最小值
   */
  co_min: number;
  /**
   * 颜色，空气质量指数表示颜色（RGB）
   */
  color: string;
  /**
   * 健康影响，本等级空气质量指数对健康的影响
   */
  health_impact: string;
  /**
   * 备注
   */
  remarks?: string;
  /**
   * SO2浓度最大值，本级别二氧化硫浓度最大值
   */
  so2_max: number;
  /**
   * SO2浓度最小值，本级别二氧化硫浓度最小值
   */
  so2_min: number;
  /**
   * SPM浓度最小值，本级别悬浮颗粒物浓度最大值
   */
  spm_max: number;
  /**
   * SPM浓度最小值，本级别悬浮颗粒物浓度最小值
   */
  spm_min: number;
  /**
   * 建议，建议采纳的措施
   */
  suggestions: string;
  [property: string]: any;
}