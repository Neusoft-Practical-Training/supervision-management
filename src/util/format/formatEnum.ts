import { AdminPermission, AqiFeedbackState, Gender, GridMemberState, Role, TaskCompletedState } from '@/common/enums'

export const formatGender = (gender: Gender): string => {
  switch (gender) {
    case Gender.Female: return "女";
    case Gender.Male: return "男";
    case Gender.Unknown: return "未知";
  }
}

export const formatGridMemberState = (gridMemberState: GridMemberState) => {
  switch (gridMemberState) {
    case GridMemberState.AwaitingReview: return "等待审核";
    case GridMemberState.Working: return "工作中";
    case GridMemberState.Idle: return "空闲";
    case GridMemberState.Other: return "其他";
    case GridMemberState.InVacation: return "休假中";
    case GridMemberState.TemporaryTransfer: return "临时抽调";
  }
}

export const formatRole = (role: Role): string => {
  switch (role) {
    case Role.Admin: return "管理员";
    case Role.Supervisor: return "监督员";
    case Role.GridMember: return "网格员";
  }
}

export const formatAdminPermission = (permission: AdminPermission): string => {
  switch (permission) {
    case AdminPermission.State: return "国家级";
    case AdminPermission.Province: return "省级";
    case AdminPermission.City: return "市级";
  }
}

export const formatAqiFeedbackState = (state: AqiFeedbackState): string => {
  switch (state) {
    case AqiFeedbackState.Unassigned: return "未指派";
    case AqiFeedbackState.Assigned: return "已指派";
    case AqiFeedbackState.Completed: return "已完成";
  }
}

export const formatTaskCompletedState = (state: TaskCompletedState): string => {
  switch (state) {
    case TaskCompletedState.Uncompleted: return "未完成";
    case TaskCompletedState.Completed: return "已完成";
    case TaskCompletedState.CrossDomainRequesting: return "跨域请求中";
    case TaskCompletedState.CrossDomainRequestDenied: return "跨域请求被拒";
    case TaskCompletedState.CrossDomainRequestAccepted: return "跨域请求被接受";
    case TaskCompletedState.CrossDomainRequestCompleted: return "跨域请求完成";
  }
}
