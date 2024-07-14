import { AdminPermission, Gender, GridMemberState, Role } from '@/common/enums'
import type { UserDTO } from '@/api/entities/user'

export const currentUser: UserDTO = new class implements UserDTO {
  age: number = 24;
  avatar: undefined;
  city_id: string = "110100";
  create_time: string = "2024-5-20";
  gender: Gender = Gender.Male;
  login_code: string = "13512341234";
  name: string = "王大明";
  permission: AdminPermission = AdminPermission.State;
  province_id: string = "110000";
  remarks: string = "北京市管理员";
  role: Role = Role.Admin;
  status: boolean = true;
  tel: string = "13512341234";
  update_time: string = "2024-5-20";
  user_id: number = 100;
  token: string = "123eghdkqwD";
}

export const gridMembers = [
  {
    age: 24,
    avatar: undefined,
    city_id: "110100",
    grid_id: "110101",
    create_time: "2023-5-21",
    gender: Gender.Male,
    login_code: "13512341234",
    name: "王小明",
    permission: undefined,
    province_id: "110000",
    remarks: "法俄发噶为嘎我嘎尾法few啊",
    role: Role.GridMember,
    state: GridMemberState.Idle,
    status: true,
    task_num: 3,
    tel: "13512341234",
    update_time: "2023-5-20",
    user_id: 0,
  },
  {
    age: 12,
    avatar: undefined,
    city_id: "110100",
    grid_id: "110101",
    create_time: "2024-5-29",
    gender: Gender.Female,
    login_code: "13512341234",
    name: "王一明",
    permission: undefined,
    province_id: "110000",
    remarks: "发发非法v阿福v啊微风",
    role: Role.GridMember,
    state: GridMemberState.Idle,
    status: true,
    task_num: 3,
    tel: "13512341234",
    update_time: "2024-5-3",
    user_id: 1,
  },
  {
    age: 35,
    avatar: undefined,
    city_id: "110100",
    grid_id: "110101",
    create_time: "2024-3-20",
    gender: Gender.Unknown,
    login_code: "13512341234",
    name: "王二明",
    permission: undefined,
    province_id: "110000",
    remarks: "吧啦吧啦吧啦吧",
    role: Role.GridMember,
    state: GridMemberState.Working,
    status: true,
    task_num: 3,
    tel: "13512341234",
    update_time: "2024-3-21",
    user_id: 2,
  }
]

export const supervisors = [
  {
    age: 52,
    avatar: undefined,
    create_time: "2024-6-20",
    gender: Gender.Male,
    login_code: "13512341234",
    name: "李小明",
    remarks: "法俄发噶为嘎我嘎尾法few啊",
    role: Role.Supervisor,
    status: true,
    tel: "13512341234",
    update_time: "2024-4-20",
    user_id: 10,
  },
  {
    age: 42,
    avatar: undefined,
    create_time: "2023-12-20",
    gender: Gender.Female,
    login_code: "13512341234",
    name: "李一明",
    remarks: "发发非法v阿福v啊微风",
    role: Role.GridMember,
    status: true,
    tel: "13512341234",
    update_time: "2024-5-2",
    user_id: 11,
  },
  {
    age: 23,
    avatar: undefined,
    create_time: "2024-5-31",
    gender: Gender.Unknown,
    login_code: "13512341234",
    name: "李二明",
    remarks: "吧啦吧啦吧啦吧",
    role: Role.Supervisor,
    status: true,
    tel: "13512341234",
    update_time: "2024-6-20",
    user_id: 21,
  }
]

export const admins = [
  {
    age: 31,
    avatar: undefined,
    city_id: "110100",
    create_time: "2023-5-21",
    gender: Gender.Male,
    login_code: "13512341234",
    name: "张小明",
    permission: AdminPermission.City,
    province_id: "110000",
    remarks: "法俄发噶为嘎我嘎尾法few啊",
    role: Role.Admin,
    status: true,
    tel: "13512341234",
    update_time: "2023-5-20",
    user_id: 100,
  },
  {
    age: 48,
    avatar: undefined,
    city_id: "110100",
    create_time: "2024-5-29",
    gender: Gender.Female,
    login_code: "13512341234",
    name: "张一明",
    permission: AdminPermission.City,
    province_id: "110000",
    remarks: "发发非法v阿福v啊微风",
    role: Role.Admin,
    status: true,
    tel: "13512341234",
    update_time: "2024-5-3",
    user_id: 200,
  },
  {
    age: 21,
    avatar: undefined,
    city_id: "110100",
    create_time: "2024-3-20",
    gender: Gender.Unknown,
    login_code: "13512341234",
    name: "张二明",
    permission: AdminPermission.City,
    province_id: "110000",
    remarks: "吧啦吧啦吧啦吧",
    role: Role.Admin,
    status: true,
    tel: "13512341234",
    update_time: "2024-3-21",
    user_id: 300,
  }
]