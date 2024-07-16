import type { Gender } from '@/common/enums'
import { LeaveRequestState } from '@/common/enums'

/**
 * LeaveRequestDTO
 */
export interface LeaveRequestDTO {
  /**
   * 请求ID，自增主键
   */
  request_id?: number;
  /**
   * 用户ID，关联用户表
   */
  user_id?: number;
  /**
   * 姓名，用户真实姓名
   */
  name?: string;
  /**
   * 用户头像，base64格式
   */
  avatarURL?: string;
  /**
   * 性别，枚举（默认为0:未知，1:男，2:女）
   */
  gender?: Gender;
  /**
   * 网格编号，仅网格员需要
   */
  grid_id?: string;
  /**
   * 电话号
   */
  tel?: string;
  /**
   * 请假开始时间
   */
  start_time?: string;
  /**
   * 请假结束时间
   */
  end_time?: string;
  /**
   * 请假天数
   */
  leave_days?: number;
  /**
   * 请假理由
   */
  reason?: string;
  /**
   * 请假请求状态，枚举（0:待审批，1:批准，2:拒绝）
   */
  state?: LeaveRequestState;
  /**
   * 创建时间
   */
  create_time?: string;
  /**
   * 修改时间
   */
  update_time?: string;
}
