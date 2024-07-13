/**
 * provinces
 */
export interface Provinces {
  /**
   * 省编号，主键
   */
  province_id: string;
  /**
   * 省名称
   */
  province_name: string;
  [property: string]: any;
}

/**
 * cities
 */
export interface Cities {
  /**
   * 城市编号，主键
   */
  city_id: string;
  /**
   * 城市名称
   */
  city_name: string;
  /**
   * 省编号，外键：provinces/province_id
   */
  province_id: string;
  /**
   * 省名称
   */
  province_name: string;
  [property: string]: any;
}

/**
 * grids
 */
export interface Grids {
  /**
   * 市编号，外键：cities/city_id
   */
  city_id: string;
  /**
   * 市名
   */
  city_name: string;
  /**
   * 区编号，主键
   */
  grid_id: string;
  /**
   * 区名
   */
  grid_name: string;
  /**
   * 省编号，外键：provinces/province_id
   */
  province_id: string;
  /**
   * 省名
   */
  province_name: string;
  [property: string]: any;
}