import { areaList } from '@vant/area-data'

export type AreaInfo = {
  province: Record<string, string>,
  city: Record<string, string>,
  grid: Record<string, string>
}

export const findAreaById = (areaId: string): AreaInfo => {
  const result: AreaInfo = {
    province: {},
    city: {},
    grid: {}
  }

  // 查找省份信息
  if (areaId.endsWith('0000')) {
    // 存入省份对应的信息
    result.province[areaId] = areaList.province_list[areaId];
    // 遍历所有城市查找属于该省的城市
    Object.keys(areaList.city_list).forEach(cityId => {
      if (cityId.substring(0, 2) === areaId.substring(0, 2)) {
        result.city[cityId] = areaList.city_list[cityId];
        // 遍历所有区县查找属于该城市的区县
        Object.keys(areaList.county_list).forEach(countyId => {
          if (countyId.substring(0, 4) === cityId.substring(0, 4)) {
            result.grid[countyId] = areaList.county_list[countyId];
          }
        });
      }
    });
  } else if (areaId.endsWith('00')) {
    // 存入城市对应的信息
    result.city[areaId] = areaList.city_list[areaId];
    // 找出省份ID
    const provinceId = areaId.substring(0, 2) + '0000';
    result.province[provinceId] = areaList.province_list[provinceId];
    // 遍历所有区县查找属于该城市的区县
    Object.keys(areaList.county_list).forEach(countyId => {
      if (countyId.substring(0, 4) === areaId.substring(0, 4)) {
        result.grid[countyId] = areaList.county_list[countyId];
      }
    });
  } else {
    // 存入区县对应的信息
    result.grid[areaId] = areaList.county_list[areaId];
    // 找出城市ID和省份ID
    const cityId = areaId.substring(0, 4) + '00';
    const provinceId = areaId.substring(0, 2) + '0000';
    result.city[cityId] = areaList.city_list[cityId];
    result.province[provinceId] = areaList.province_list[provinceId];
  }

  return result;
}

export const formatAddress = (result: AreaInfo): string => {
  // 提取省、市、区名称
  const provinceName = Object.values(result.province)[0] || '';
  const cityName = Object.values(result.city)[0] || '';
  const gridName = Object.values(result.grid)[0] || '';

  // 将省、市、区名称拼接成完整地址
  return `${provinceName}/${cityName}/${gridName}`;
}