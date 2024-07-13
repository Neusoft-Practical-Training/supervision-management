import { ref } from 'vue'
import { defineStore } from 'pinia'
import {type UserDTO} from "@/api/entities/user";

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const user = ref<UserDTO>()
    const setUserDTO = (u: UserDTO) => {
      user.value = u
      token.value = u.token!
      console.log(token.value)
    }
    const logout = () => {
      user.value = undefined
      token.value = ''
    }
    return { token, user, setUserDTO, logout }
  },
  {
    // 持久化配置
    persist: true
  }
)
