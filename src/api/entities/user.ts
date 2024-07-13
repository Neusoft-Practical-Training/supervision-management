import { type AdminPermission, type Gender, type GridMemberState, type Role } from "@/common/enums";

/**
 * userDTO
 */
export interface UserDTO {
  /**
   * 年龄
   */
  age?: number;
  /**
   * 用户头像，base64格式
   */
  avatar?: string;
  /**
   * 市编号，仅管理员与网格员需要
   */
  city_id?: string;
  /**
   * 网格编号，仅网格员需要
   */
  grid_id?: string;
  /**
   * 创建时间
   */
  create_time?: string;
  /**
   * 性别，枚举（默认为0:未知，1:男，2:女）
   */
  gender?: Gender;
  /**
   * 登录编码，对于公众监督员使用其手机号，其余用户尽量使用其手机号，若冲突，再做一定处理
   */
  login_code?: string;
  /**
   * 姓名，用户真实姓名
   */
  name?: string;
  /**
   * 管理员权限，仅管理员需要，枚举（0:全国，1:省级，2：市级）
   */
  permission?: AdminPermission;
  /**
   * 省编号，仅管理员与网格员需要
   */
  province_id?: string;
  /**
   * 备注，非必需
   */
  remarks?: string;
  /**
   * 角色，枚举（0:管理员，2:公众监督员，3:网格员）
   */
  role?: Role;
  /**
   * 网格员状态，仅网格员需要，枚举（0:空闲，1:工作中，2:临时抽调，3:休假，4：待审核，5:其他）
   */
  state?: GridMemberState;
  /**
   * 状态，布尔（0：不可用，默认为1：可用）
   */
  status?: boolean;
  /**
   * 任务数量，仅网格员需要，待完成任务数量
   */
  task_num?: number;
  /**
   * 手机号
   */
  tel?: string;
  /**
   * 登录token
   */
  token?: string;
  /**
   * 修改时间
   */
  update_time?: string;
  /**
   * 用户ID，自增主键
   */
  user_id?: number;
  [property: string]: any;
}
