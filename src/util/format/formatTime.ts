export const formatUseTime = (createTime: string): string => {
  // 解析给定的 createTime 为 Date 对象
  const startDate = new Date(createTime);

  // 获取当前时间的 Date 对象
  const currentDate = new Date();

  // 计算两个日期之间的毫秒差
  const diffInMs = currentDate.getTime() - startDate.getTime();

  // 将毫秒差转换为天数
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // 返回天数差，根据需要可以转换为字符串或保持为数字
  return diffInDays.toString();
}