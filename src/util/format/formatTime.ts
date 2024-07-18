export const formatUseTime = (createTime: string): string => {
  // 解析给定的 createTime 为 Date 对象
  const startDate = new Date(createTime);

  // 获取当前时间的 Date 对象
  const currentDate = new Date();

  // 计算两个日期之间的毫秒差
  const diffInMs = currentDate.getTime() - startDate.getTime();

  // 将毫秒差转换为天数
  const diffInDays = Math.max(Math.floor(diffInMs / (1000 * 60 * 60 * 24)), 0);

  // 返回天数差，根据需要可以转换为字符串或保持为数字
  return diffInDays.toString();
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;  // getMonth() 返回的是 0-11，所以需要加1
  const day = date.getDate();

  // 使用模板字符串来格式化，确保月份和日期为两位数
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

/**
 * formatLeaveDuration
 * @param startTime - The start time of the leave in ISO string format
 * @param endTime - The end time of the leave in ISO string format
 * @returns The duration of the leave in days
 */
export function formatLeaveDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${duration} 天`;
}
