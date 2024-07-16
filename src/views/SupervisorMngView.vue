<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Gender } from '@/common/enums'
import { supervisors } from '@/common/testData'
import type { UserDTO } from '@/api/entities/user'
import { formatGender, formatUseTime } from '@/util'
import { useUserStore } from '@/stores'
import { getSupervisors, selectSupervisors, setUserStatus } from '@/api'
import { BASE_AVATAR_URL } from '@/common/constants'

const showData = ref<UserDTO>()
const user: UserDTO = useUserStore().user!
const currentPage = ref<number>()

// disabled account
const statusChange = async (row: UserDTO) => {
  try {
    const success: boolean = await setUserStatus(row.user_id!)
    if (success) {
      ElMessage.success('已设置该账户状态为' + (row.status ? '可用' : '禁用'))
    }
  } catch (err) {
    console.log('Failed to set user status', err)
    ElMessage.success('已设置该账户状态为' + (row.status ? '可用' : '禁用'))
  }
}

// view detail
const detailBoxVisible = ref<boolean>(false)
const userDetail = ref<UserDTO>({})
const viewDetail = (row: UserDTO) => {
  userDetail.value = row
  detailBoxVisible.value = true
}

export type SearchSupervisorCondition = {
  name?: string,
  gender?: Gender,
  status?: boolean
}

// search box data
const searchCondition = ref<SearchSupervisorCondition>({
  name: '',
  gender: undefined,
  status: undefined
})

const clear = () => {
  searchCondition.value = {
    name: '',
    gender: undefined,
    status: undefined
  }
}

onBeforeMount(async () => {
  try {
    showData.value = await getSupervisors(user.user_id!)
  } catch (err) {
    console.log('Failed to get supervisors', err)
    showData.value = supervisors
  }
})

const handleQuery = async () => {
  try {
    showData.value = await selectSupervisors({
      adminId: user.user_id!,
      condition: searchCondition.value
    })
  } catch (err) {
    console.log('Failed to select supervisors', err)
    query()
  }
}

const query = () => {
  showData.value = supervisors.filter((item) => {
    // username
    if (searchCondition.value.name) {
      if (!item.name!.includes(searchCondition.value.name)) {
        return false
      }
    }
    // gender
    if (searchCondition.value.gender !== undefined) {
      if (!(searchCondition.value.gender === item.gender)) {
        return false
      }
    }
    // status
    if (searchCondition.value.status != undefined) {
      if (searchCondition.value.status && !item.status) {
        return false
      }
      if (!searchCondition.value.status && item.status) {
        return false
      }
    }
    return true
  })
}
</script>

<template>
  <div>
    <div class="search">
      <el-form :inline="true" :model="searchCondition" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchCondition.name" clearable />
        </el-form-item>
        <el-form-item label="性别" label-width="auto">
          <el-select v-model="searchCondition.gender" clearable style="width: 100px">
            <el-option
              v-for="option in Object.values(Gender).filter(value => typeof value === 'number')"
              :key="option"
              :label="formatGender(option as Gender)"
              :value="option"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-select v-model="searchCondition.status" clearable style="width: 100px">
            <el-option label="可用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">清空</el-button>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- data table -->
    <div class="table">
      <el-table :data="showData" style="width: 100%" max-height="680px">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="user_id" label="用户ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="avatarURL" label="头像">
          <template #default="{ row }">
            <img class="avatar" :src="row.avatarURL ? row.avatarURL : BASE_AVATAR_URL" alt="avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别">
          <template #default="{ row }">
            <el-tag>{{ formatGender(row.gender) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="使用时长/天">
          <template #default="{ row }">
            {{ formatUseTime(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账户是否可用">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-icon="Check"
              :inactive-icon="Close"
              @change="statusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)"
            >详情
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-count="Math.ceil(showData!.length / 10)"
                     :current-page="currentPage" />
    </div>

    <!-- detail dialog -->
    <div class="detail-dialog">
      <el-dialog v-model="detailBoxVisible" title="">
        <div class="detail">
          <el-form
            label-position="right"
            label-width="100px"
            :model="userDetail"
            style="max-width: 80%"
            disabled
          >
            <el-form-item label="头像"
            >
              <el-avatar :size="100" :src="userDetail.avatarURL ? userDetail.avatarURL : BASE_AVATAR_URL" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input :value="userDetail.name" />
            </el-form-item>
            <el-form-item label="性别">
              <el-input :value="formatGender(userDetail.gender!)" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input :value="userDetail.tel" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                autosize="true"
                type="textarea"
                :value="userDetail.remarks"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="detailBoxVisible = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.avatar {
  width: 50px;
  height: 50px;
  max-width: 100%;
  max-height: 100%;
}
</style>