import axios, { type AxiosResponse } from 'axios'
import { HTTP_HOST } from '@/common/constants'
import router from '@/router'

import { type Result } from './entities/result'
import { useUserStore } from "@/stores/modules/user";

import { type UserDTO } from './entities/user';
import type { SearchGridMemberCondition } from '@/views/GridMemberMngView.vue'
import type { SearchSupervisorCondition } from '@/views/SupervisorMngView.vue'
import type { SearchAdminCondition } from '@/views/AdminMngView.vue'

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
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
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
  (await instance.get<UserDTO[]>(`/getGridMembers/${ adminId }`)).data

// 获得辖区内所有的监督员
export const getSupervisors = async (adminId: number) =>
  (await instance.get<UserDTO[]>(`/getSupervisors/${ adminId }`)).data

// 获得辖区内所有的管理员
export const getAdmins = async (adminId: number) =>
  (await instance.get<UserDTO[]>(`/getAdmins/${ adminId }`)).data

export const selectGridMembers = async (data: {adminId: number, condition: SearchGridMemberCondition}) =>
  (await instance.post<UserDTO[]>('/selectGridMembers', data)).data

export const setUserStatus = async (userId: number) =>
  (await instance.get<boolean>(`/setUserStatus/${ userId }`)).data

export const setUserRemarks = async (data: {userId: number, remarks: string}) =>
  (await instance.post<boolean>('/setUserRemarks', data)).data

export const selectSupervisors = async (data: {adminId: number, condition: SearchSupervisorCondition}) =>
  (await instance.post<UserDTO[]>('/selectSupervisors', data)).data

export const selectAdmins = async (data: {adminId: number, condition: SearchAdminCondition}) =>
  (await instance.post<UserDTO[]>('/selectAdmins', data)).data