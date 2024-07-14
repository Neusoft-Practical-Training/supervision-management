<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { UserDTO } from '@/api/entities/user'
import { login } from '@/api'
import router from '@/router'
import { Role } from '@/common/enums'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { currentUser } from '@/common/testData'

const loginForm = ref({
  username: '',
  password: ''
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '密码长度为?', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 10, message: '密码长度为?', trigger: 'blur' }
  ]
})
const onSubmit = async () => {
  try {
    const user: UserDTO = await login(loginForm.value)
    if (user.status && user.role == Role.Admin) {
      const userStore = useUserStore()
      userStore.setUserDTO(user)
      await router.push('/home')
    } else {
      ElMessage({ type: 'warning', message: '账号不可用，请联系管理员!' })
    }
  } catch (err) {
    // TODO show error
    // ElMessage({ type: 'error', message: (err as Result<any>).message! })
    // 测试数据
    useUserStore().setUserDTO(currentUser)
    await router.push('/home')
  }
}
</script>

<template>
  <div class="login-div">
    <h1>登录</h1>
    <el-form
      ref="formRef"
      :model="loginForm"
      status-icon
      :rules="rules"
      class="login-form"
    >
      <el-form-item prop="username">
        <el-input
          prefix-icon="User"
          v-model.trim="loginForm.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          prefix-icon="Lock"
          v-model.trim="loginForm.password"
          type="password"
          placeholder="请输入密码"
          clearable
        />
      </el-form-item>
    </el-form>
    <div class="flex">
      <el-checkbox>记住密码</el-checkbox>
      <el-link type="primary" :underline="false">忘记密码？</el-link>
    </div>
    <el-button class="button" auto-insert-space type="primary" @click="onSubmit"
    >登录
    </el-button
    >
  </div>
</template>

<style scoped>
.login-div {
  width: 350px;
  height: 300px;
  padding: 0 30px;
  border: 1px solid #2f2f2f;
  border-radius: 8px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.button {
  margin-top: 10px;
  width: 70%;
}
</style>