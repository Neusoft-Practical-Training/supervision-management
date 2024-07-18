import {
  AdminPermission,
  AqiFeedbackState,
  Gender,
  GridMemberState,
  LeaveRequestState,
  Role,
  TaskCompletedState
} from '@/common/enums'
import type { UserDTO } from '@/api/entities/user'
import type { AqiFeedback } from '@/api/entities/feedback'
import type { AqiAssignment } from '@/api/entities/assign'
import type { AqiStatistics } from '@/api/entities/confirm'
import type { LeaveRequestDTO } from '@/api/entities/leaveRequest'

export const currentUser: UserDTO = new class implements UserDTO {
  age: number = 24
  avatar: undefined
  city_id: string = '110100'
  create_time: string = '2024/5/20'
  gender: Gender = Gender.Male
  login_code: string = '13512341234'
  name: string = '王大明'
  permission: AdminPermission = AdminPermission.State
  province_id: string = '110000'
  remarks: string = '北京市管理员'
  role: Role = Role.Admin
  status: boolean = true
  tel: string = '13512341234'
  update_time: string = '2024/5/20'
  user_id: number = 100
  token: string = '123eghdkqwD'
}

export const gridMembers: UserDTO[] = [
  {
    age: 24,
    avatar: undefined,
    city_id: '110100',
    grid_id: '110101',
    create_time: '2023/5/21',
    gender: Gender.Male,
    login_code: '13512341234',
    name: '王小明',
    permission: undefined,
    province_id: '110000',
    remarks: '法俄发噶为嘎我嘎尾法few啊',
    role: Role.GridMember,
    state: GridMemberState.Idle,
    status: true,
    task_num: 3,
    tel: '13512341234',
    update_time: '2023/5/20',
    user_id: 0
  },
  {
    age: 12,
    avatar: undefined,
    city_id: '110100',
    grid_id: '110101',
    create_time: '2024/5/29',
    gender: Gender.Female,
    login_code: '13512341234',
    name: '王一明',
    permission: undefined,
    province_id: '110000',
    remarks: '发发非法v阿福v啊微风',
    role: Role.GridMember,
    state: GridMemberState.Idle,
    status: true,
    task_num: 3,
    tel: '13512341234',
    update_time: '2024/5/3',
    user_id: 1
  },
  {
    age: 35,
    avatar: undefined,
    city_id: '110100',
    grid_id: '110101',
    create_time: '2024/3/20',
    gender: Gender.Unknown,
    login_code: '13512341234',
    name: '王二明',
    permission: undefined,
    province_id: '110000',
    remarks: '吧啦吧啦吧啦吧',
    role: Role.GridMember,
    state: GridMemberState.Working,
    status: true,
    task_num: 3,
    tel: '13512341234',
    update_time: '2024/3/21',
    user_id: 2
  }
]

export const supervisors: UserDTO[] = [
  {
    age: 52,
    avatar: undefined,
    create_time: '2024/6/20',
    gender: Gender.Male,
    login_code: '13512341234',
    name: '李小明',
    remarks: '法俄发噶为嘎我嘎尾法few啊',
    role: Role.Supervisor,
    status: true,
    tel: '13512341234',
    update_time: '2024/4/20',
    user_id: 10
  },
  {
    age: 42,
    avatar: undefined,
    create_time: '2023/12/20',
    gender: Gender.Female,
    login_code: '13512341234',
    name: '李一明',
    remarks: '发发非法v阿福v啊微风',
    role: Role.GridMember,
    status: true,
    tel: '13512341234',
    update_time: '2024/5/2',
    user_id: 11
  },
  {
    age: 23,
    avatar: undefined,
    create_time: '2024/5/31',
    gender: Gender.Unknown,
    login_code: '13512341234',
    name: '李二明',
    remarks: '吧啦吧啦吧啦吧',
    role: Role.Supervisor,
    status: true,
    tel: '13512341234',
    update_time: '2024/6/20',
    user_id: 21
  }
]

export const admins: UserDTO[] = [
  {
    age: 31,
    avatar: undefined,
    city_id: '110100',
    create_time: '2023/5/21',
    gender: Gender.Male,
    login_code: '13512341234',
    name: '张小明',
    permission: AdminPermission.City,
    province_id: '110000',
    remarks: '法俄发噶为嘎我嘎尾法few啊',
    role: Role.Admin,
    status: true,
    tel: '13512341234',
    update_time: '2023/5/20',
    user_id: 100
  },
  {
    age: 48,
    avatar: undefined,
    city_id: '110100',
    create_time: '2024/5/29',
    gender: Gender.Female,
    login_code: '13512341234',
    name: '张一明',
    permission: AdminPermission.City,
    province_id: '110000',
    remarks: '发发非法v阿福v啊微风',
    role: Role.Admin,
    status: true,
    tel: '13512341234',
    update_time: '2024/5/3',
    user_id: 200
  },
  {
    age: 21,
    avatar: undefined,
    city_id: '110100',
    create_time: '2024/3/20',
    gender: Gender.Unknown,
    login_code: '13512341234',
    name: '张二明',
    permission: AdminPermission.City,
    province_id: '110000',
    remarks: '吧啦吧啦吧啦吧',
    role: Role.Admin,
    status: true,
    tel: '13512341234',
    update_time: '2024/3/21',
    user_id: 300
  }
]

export const feedbacks: AqiFeedback[] = [
  {
    af_id: 0,
    supervisor_id: 10,
    grid_id: '110101',
    address: '安定门东大街 28 号雍和大厦',
    pre_aqi_id: 0,
    explain: '啊就收到了；负我大额度',
    af_date: '2024/5/30',
    af_time: '12:00',
    state: AqiFeedbackState.Unassigned,
    aa_id: undefined,
    remarks: ''
  },
  {
    af_id: 1,
    supervisor_id: 11,
    grid_id: '110102',
    address: '西直门南大街 2 号成铭大厦',
    pre_aqi_id: 0,
    explain: '啊就收到了；负我大额度',
    af_date: '2024/4/23',
    af_time: '17:00',
    state: AqiFeedbackState.Assigned,
    aa_id: 0,
    remarks: ''
  },
  {
    af_id: 2,
    supervisor_id: 12,
    grid_id: '110105',
    address: '北辰东路 8 号北辰时代大厦',
    pre_aqi_id: 0,
    explain: '啊就收到了；负我大额度',
    af_date: '2024/6/7',
    af_time: '14:00',
    state: AqiFeedbackState.Completed,
    aa_id: 1,
    remarks: ''
  },
  {
    af_id: 3,
    supervisor_id: 13,
    grid_id: '110101',
    address: '北京市东城区东直门南大街 1 号来福士中心',
    pre_aqi_id: 1,
    explain: '啊就收到了；负我大额度',
    af_date: '2024/7/7',
    af_time: '14:00',
    state: AqiFeedbackState.Assigned,
    aa_id: 2,
    remarks: ''
  },
  {
    af_id: 4,
    supervisor_id: 14,
    grid_id: '110105',
    address: '北京市朝阳区东三环中路 39 号建外 SOHO',
    pre_aqi_id: 2,
    explain: '阿迪是否违反撒范德萨丰富',
    af_date: '2024/7/1',
    af_time: '14:00',
    state: AqiFeedbackState.Assigned,
    aa_id: 3,
    remarks: ''
  },
  {
    af_id: 5,
    supervisor_id: 14,
    grid_id: '110105',
    address: '北京市朝阳区望京街 9 号望京国际商业中心',
    pre_aqi_id: 2,
    explain: '法教大家发放',
    af_date: '2024/7/1',
    af_time: '14:00',
    state: AqiFeedbackState.Assigned,
    aa_id: 4,
    remarks: ''
  },
  {
    af_id: 6,
    supervisor_id: 14,
    grid_id: '110105',
    address: '北京市朝阳区光华路 9 号天阶大厦',
    pre_aqi_id: 0,
    explain: '法俄发动是非得失飞飞飞飞',
    af_date: '2024/7/2',
    af_time: '14:00',
    state: AqiFeedbackState.Completed,
    aa_id: 5,
    remarks: ''
  }
]

export const assignments: AqiAssignment[] = [
  {
    aa_id: 0,
    af_id: 1,
    as_id: undefined,
    admin_id: 100,
    supervisor_id: 11,
    gm_id: 0,
    grid_id: '110102',
    address: '西直门南大街 2 号成铭大厦',
    assign_date: '2024/6/7',
    assign_time: '13:00',
    cross_domain: false,
    completed: TaskCompletedState.Uncompleted,
    remarks: ''
  },
  {
    aa_id: 1,
    af_id: 2,
    as_id: 0,
    admin_id: 100,
    supervisor_id: 12,
    gm_id: 1,
    grid_id: '110105',
    address: '北辰东路 8 号北辰时代大厦',
    assign_date: '2024/6/7',
    assign_time: '13:00',
    cross_domain: false,
    completed: TaskCompletedState.Completed,
    remarks: ''
  },
  {
    aa_id: 2,
    af_id: 3,
    as_id: undefined,
    admin_id: 100,
    supervisor_id: 12,
    gm_id: undefined,
    grid_id: '110101',
    address: '北京市东城区东直门南大街 1 号来福士中心',
    assign_date: undefined,
    assign_time: undefined,
    cross_domain: true,
    completed: TaskCompletedState.CrossDomainRequesting,
    remarks: ''
  },
  {
    aa_id: 3,
    af_id: 4,
    as_id: undefined,
    admin_id: 100,
    supervisor_id: 12,
    gm_id: undefined,
    grid_id: '110105',
    address: '北京市朝阳区东三环中路 39 号建外 SOHO',
    assign_date: undefined,
    assign_time: undefined,
    cross_domain: true,
    completed: TaskCompletedState.CrossDomainRequestDenied,
    remarks: ''
  },
  {
    aa_id: 4,
    af_id: 5,
    as_id: undefined,
    admin_id: 100,
    supervisor_id: 12,
    gm_id: 1,
    grid_id: '110105',
    address: '北京市朝阳区望京街 9 号望京国际商业中心',
    assign_date: '2024/7/11',
    assign_time: '13:00',
    cross_domain: true,
    completed: TaskCompletedState.CrossDomainRequestAccepted,
    remarks: ''
  },
  {
    aa_id: 5,
    af_id: 6,
    as_id: 1,
    admin_id: 100,
    supervisor_id: 12,
    gm_id: 2,
    grid_id: '110105',
    address: '北京市朝阳区光华路 9 号天阶大厦',
    assign_date: '2024/7/11',
    assign_time: '13:00',
    cross_domain: true,
    completed: TaskCompletedState.CrossDomainRequestCompleted,
    remarks: ''
  }
]

export const confirms: AqiStatistics[] = [
  {
    aa_id: 1,
    address: '北辰东路 8 号北辰时代大厦',
    as_id: 0,
    co_level: 1,
    co_value: 10,
    confirm_aqi_id: 0,
    confirm_date: '2024/7/10',
    confirm_time: '16:00',
    gm_id: 1,
    grid_id: '110105',
    remarks: '似水流年是一个人所有的一切，只有这个东西，才真正归你所有。其余的一切，都是片刻的欢娱和不幸，转眼间就已跑到那似水流年里去了。',
    so2_level: 2,
    so2_value: 50,
    spm_level: 1,
    spm_value: 30
  },
  {
    aa_id: 5,
    address: '北京市朝阳区光华路 9 号天阶大厦',
    as_id: 1,
    co_level: 2,
    co_value: 50,
    confirm_aqi_id: 2,
    confirm_date: '2024/7/10',
    confirm_time: '16:00',
    gm_id: 1,
    grid_id: '110105',
    remarks: '似水流年是一个人所有的一切，只有这个东西，才真正归你所有。其余的一切，都是片刻的欢娱和不幸，转眼间就已跑到那似水流年里去了。',
    so2_level: 2,
    so2_value: 50,
    spm_level: 2,
    spm_value: 50
  }
]

export const leaveRequests: LeaveRequestDTO[] = [
  {
    request_id: 1,
    user_id: 101,
    name: '王小明',
    gender: Gender.Male,
    grid_id: '110101',
    tel: '13509876543',
    start_time: '2024/07/10T08:00:00Z',
    end_time: '2024/07/15T17:00:00Z',
    leave_days: 5,
    reason: '我想出去玩！！！！',
    state: LeaveRequestState.Pending,
    create_time: '2024/07/01T10:00:00Z',
    update_time: '2024/07/01T10:00:00Z'
  },
  {
    request_id: 2,
    user_id: 102,
    name: 'Jane Smith',
    gender: Gender.Female,
    grid_id: '110102',
    tel: '13511112222',
    start_time: '2024/08/01T09:00:00Z',
    end_time: '2024/08/10T18:00:00Z',
    leave_days: 10,
    reason: 'Medical leave',
    state: LeaveRequestState.Approved,
    create_time: '2024/07/15T12:00:00Z',
    update_time: '2024/07/16T08:00:00Z'
  },
  {
    request_id: 3,
    user_id: 103,
    name: 'Alice Johnson',
    gender: Gender.Female,
    grid_id: '110101',
    tel: '13512344321',
    start_time: '2024/07/20T08:00:00Z',
    end_time: '2024/07/25T17:00:00Z',
    leave_days: 5,
    reason: 'Personal reasons',
    state: LeaveRequestState.Rejected,
    create_time: '2024/07/05T11:00:00Z',
    update_time: '2024/07/10T09:00:00Z'
  },
  {
    request_id: 4,
    user_id: 104,
    name: 'Bob Brown',
    gender: Gender.Male,
    grid_id: '110102',
    tel: '13512341231',
    start_time: '2024/09/01T09:00:00Z',
    end_time: '2024/09/07T17:00:00Z',
    leave_days: 6,
    reason: 'Conference attendance',
    state: LeaveRequestState.Pending,
    create_time: '2024/08/20T13:00:00Z',
    update_time: '2024/08/20T13:00:00Z'
  },
  {
    request_id: 5,
    user_id: 105,
    name: 'Charlie Davis',
    gender: Gender.Male,
    grid_id: '110105',
    tel: '13512341234',
    start_time: '2024/07/18T08:00:00Z',
    end_time: '2024/07/19T17:00:00Z',
    leave_days: 2,
    reason: 'Urgent personal matter',
    state: LeaveRequestState.Pending,
    create_time: '2024/07/10T09:00:00Z',
    update_time: '2024/07/10T09:00:00Z'
  }
]