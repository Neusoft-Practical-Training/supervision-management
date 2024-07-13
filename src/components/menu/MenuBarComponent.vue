<script setup lang="ts">
import router from '@/router'
const menuItems = [
  { route: '/home', icon: 'House', title: '首页' },
  {
    hasSubmenu: true,
    icon: 'User',
    title: '用户管理',
    children: [
      { route: '/gridMember', icon: 'User', title: '网格员管理' },
      { route: '/supervisor', icon: 'UserFilled', title: '公众监督员管理' },
      { route: '/admin', icon: 'Avatar', title: '下属管理员' }
    ]
  },
  { route: '/assign', icon: 'Document', title: '任务指派' },
  { route: '/crossDomain', icon: 'Suitcase', title: '跨域申请' },
  { route: '/vacation', icon: 'Ship', title: '休假申请' },
]
const logout = () => {
  // TODO:登出
  router.push('/login')
}
</script>

<template>
  <el-menu default-active="0" class="el-menu-vertical-demo" router>
    <template v-for="(item, index) in menuItems" :key="index">
      <el-menu-item
        v-if="!item.hasSubmenu"
        :index="index + ''"
        :route="item.route"
      >
        <component class="el-icon" :is="item.icon"></component>
        <span>{{ item.title }}</span>
      </el-menu-item>
      <el-sub-menu v-else :index="index + ''">
        <template #title>
          <component class="el-icon" :is="item.icon"></component>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="(child, subIndex) in item.children"
          :key="subIndex"
          :index="index + '-' + subIndex"
          :route="child.route"
        >{{ child.title }}</el-menu-item
        >
      </el-sub-menu>
    </template>
    <el-menu-item @click="logout">
      <el-icon><CloseBold /></el-icon>
      <span>退出登录</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped></style>