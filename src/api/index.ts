import axios, { type AxiosResponse } from 'axios'
import { HTTP_HOST } from '@/common/constants'
import router from '@/router'

import { type Result } from './entities/result'
import { useUserStore } from '@/stores/modules/user'

import { type UserDTO } from './entities/user'
import type { SearchGridMemberCondition } from '@/views/GridMemberMngView.vue'
import type { SearchSupervisorCondition } from '@/views/SupervisorMngView.vue'
import type { SearchAdminCondition } from '@/views/AdminMngView.vue'
import type { AqiFeedback } from '@/api/entities/feedback'
import type { AqiStatistics } from '@/api/entities/confirm'
import type { AqiAssignment } from '@/api/entities/assign'
import type { SearchFeedbackCondition } from '@/views/AssignMngView.vue'
import type { SearchCrossDomainAssignmentCondition } from '@/views/CrossDomainRequestView.vue'
import type { LeaveRequestDTO } from '@/api/entities/leaveRequest'
import type { SearchLeaveRequestCondition } from '@/views/LeaveRequestView.vue'
import type { LeaveRequestState } from '@/common/enums'

const baseURL = HTTP_HOST
// const baseURL = 'http://127.0.0.1:8080'

const instance = axios.create({
  baseURL,
  timeout: 1145141919
})

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res: AxiosResponse<Result<any>>) => {
    // console.log(res)
    if (res.status === 200) {
      switch (res.data.code) {
        case 0:
          res.data = res.data.data
          return Promise.resolve(res)
        case 2:
          // 如果需要登录，则跳转登录页面
          router.push('/login').then(() => {
            window.alert('用户未登录!')
          })
          return Promise.reject(res.data)
        default:
          return Promise.reject(res.data)
      }
    } else {
      // fail
      return Promise.reject(res.data)
    }
  },
  (err) => {
    // fail
    console.log(err)
  }
)

export default instance

export const login = async (data: { username: string; password: string }) =>
  (await instance.post<UserDTO>('/login', data)).data

// 获得辖区内所有的网格员
export const getGridMembers = async (adminId: number) =>
  (await instance.get<UserDTO[]>(`/getGridMembers/${adminId}`)).data

// 获得辖区内所有的监督员
export const getSupervisors = async (adminId: number) =>
  (await instance.get<UserDTO[]>(`/getSupervisors/${adminId}`)).data

// 获得辖区内所有的管理员
export const getAdmins = async (adminId: number) =>
  (await instance.get<UserDTO[]>(`/getAdmins/${adminId}`)).data

export const selectGridMembers = async (data: { adminId: number, condition: SearchGridMemberCondition }) =>
  (await instance.post<UserDTO[]>('/selectGridMembers', data)).data

export const setUserStatus = async (userId: number) =>
  (await instance.get<boolean>(`/setUserStatus/${userId}`)).data

export const setUserRemarks = async (data: { userId: number, remarks: string }) =>
  (await instance.post<boolean>('/setUserRemarks', data)).data

export const selectSupervisors = async (data: { adminId: number, condition: SearchSupervisorCondition }) =>
  (await instance.post<UserDTO[]>('/selectSupervisors', data)).data

export const selectAdmins = async (data: { adminId: number, condition: SearchAdminCondition }) =>
  (await instance.post<UserDTO[]>('/selectAdmins', data)).data

export const getFeedbacks = async (adminId: number) =>
  (await instance.get<AqiFeedback[]>(`/getFeedbacks/${adminId}`)).data

export const getTask = async (taskId: number) =>
  (await instance.get<AqiAssignment>(`/getTask/${taskId}`)).data

export const getConfirmDetail = async (confirmId: number) =>
  (await instance.get<AqiStatistics>(`/getConfirmDetail/${confirmId}`)).data

export const getGridMembersByGridId = async (gridId: string) =>
  (await instance.get<UserDTO[]>(`/getGridMembersByGridId/${gridId}`)).data

export const assignCommon = async (assignment: AqiAssignment) =>
  (await instance.post<AqiAssignment>('/assignCommon', assignment)).data

export const assignCrossDomainRequest = async (data: { city_id: string, assignment: AqiAssignment }) =>
  (await instance.post<AqiAssignment>('/assignCrossDomainRequest', data)).data

export const selectFeedbacks = async (data: { adminId: number, condition: SearchFeedbackCondition }) =>
  (await instance.post<AqiFeedback[]>('/selectFeedbacks', data)).data

export const getCrossDomainAssignments = async (adminId: number) =>
  (await instance.get<AqiAssignment[]>(`/getCrossDomainAssignments/${adminId}`)).data

export const getFeedback = async (feedbackId: number) =>
  (await instance.get<AqiFeedback>(`/getFeedback/${feedbackId}`)).data

export const assignCrossDomainAccept = async (assignment: AqiAssignment) =>
  (await instance.post<AqiAssignment>('/assignCrossDomainAccept', assignment)).data

export const assignCrossDomainDeny = async (assignment: AqiAssignment) =>
  (await instance.post<AqiAssignment>('/assignCrossDomainDeny', assignment)).data

export const selectCrossDomainAssignments = async (data: {
  adminId: number,
  condition: SearchCrossDomainAssignmentCondition
}) =>
  (await instance.post<AqiAssignment[]>('/selectCrossDomainAssignments', data)).data

// 获得辖区内所有的请假申请
export const getLeaveRequests = async (adminId: number) =>
  (await instance.get<LeaveRequestDTO[]>(`/getLeaveRequests/${adminId}`)).data

export const updateLeaveRequestStatus = async (data: { request_id: number, state: LeaveRequestState }) =>
  (await instance.post<boolean>('/updateLeaveRequestStatus', data)).data

export const selectLeaveRequests = async (data: { adminId: number, condition: SearchLeaveRequestCondition }) =>
  (await instance.post<AqiAssignment[]>('/selectLeaveRequests', data)).data