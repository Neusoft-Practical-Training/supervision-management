<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Gender, LeaveRequestState } from '@/common/enums'
import { leaveRequests } from '@/common/testData'
import type { LeaveRequestDTO } from '@/api/entities/leaveRequest'
import { type AreaInfo, findAreaById, formatGender, formatLeaveRequestState, formatLeaveDuration } from '@/util'
import { useUserStore } from '@/stores'
import { getLeaveRequests, selectLeaveRequests, updateLeaveRequestStatus } from '@/api'
import { BASE_AVATAR_URL } from '@/common/constants'
import type { UserDTO } from '@/api/entities/user'

const showData = ref<LeaveRequestDTO[]>([])
const city = ref<AreaInfo>()
const user: UserDTO = useUserStore().user!
const currentPage = ref<number>(1)

// Update leave request status
const statusChange = async (row: LeaveRequestDTO, newState: LeaveRequestState) => {
  try {
    const success: boolean = await updateLeaveRequestStatus({ request_id: row.request_id!, state: newState })
    if (success) {
      ElMessage.success('已更新该请假请求状态为' + formatLeaveRequestState(newState))
    } else {
      row.state = LeaveRequestState.Pending
      ElMessage.warning('更新该请假请求状态为' + formatLeaveRequestState(newState) + '失败')
    }
  } catch (err) {
    console.log('Failed to update leave request status', err)
    console.log(row)
    ElMessage.success('已更新该请假请求状态为' + formatLeaveRequestState(newState))
  }
}

// View detail
const detailBoxVisible = ref<boolean>(false)
const leaveRequestDetail = ref<LeaveRequestDTO>({})
const viewDetail = (row: LeaveRequestDTO) => {
  leaveRequestDetail.value = row
  detailBoxVisible.value = true
}

export type SearchLeaveRequestCondition = {
  name?: string,
  gender?: Gender,
  grid_id?: string,
  state?: LeaveRequestState,
}

// Search box data
const searchCondition = ref<SearchLeaveRequestCondition>({
  name: '',
  gender: undefined,
  grid_id: '',
  state: undefined
})

const clear = () => {
  searchCondition.value = {
    name: '',
    gender: undefined,
    grid_id: '',
    state: undefined
  }
}

onBeforeMount(async () => {
  city.value = findAreaById(user.city_id!)
  try {
    showData.value = await getLeaveRequests(user.user_id!)
  } catch (err) {
    console.log('Failed to get leave requests', err)
    showData.value = leaveRequests
  }
})

const handleQuery = async () => {
  try {
    showData.value = await selectLeaveRequests({
      adminId: user.user_id!,
      condition: searchCondition.value
    })
  } catch (err) {
    console.log('Failed to select leave requests', err)
    query()
  }
}

const query = () => {
  showData.value = leaveRequests.filter((item) => {
    // name
    if (searchCondition.value.name) {
      if (!item.name!.includes(searchCondition.value.name)) {
        return false
      }
    }
    // grid
    if (searchCondition.value.grid_id) {
      if (!item.grid_id!.includes(searchCondition.value.grid_id)) {
        return false
      }
    }
    // gender
    if (searchCondition.value.gender !== undefined) {
      if (!(searchCondition.value.gender === item.gender)) {
        return false
      }
    }
    // state
    if (searchCondition.value.state != undefined) {
      if (!(searchCondition.value.state === item.state)) {
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
        <el-form-item label="状态">
          <el-select v-model="searchCondition.state" clearable style="width: 100px">
            <el-option
              v-for="option in Object.values(LeaveRequestState).filter(value => typeof value === 'number')"
              :key="option"
              :label="formatLeaveRequestState(option as LeaveRequestState)"
              :value="option"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网格">
          <el-select v-model="searchCondition.grid_id" clearable style="width: 100px">
            <el-option
              v-for="(name, code) in city?.grid"
              :key="code"
              :label="name"
              :value="code"
            />
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
        <el-table-column prop="request_id" label="请求ID" width="80" />
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
        <el-table-column prop="state" label="状态">
          <template #default="{ row }">
            <el-tag>{{ formatLeaveRequestState(row.state) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="grid_id" label="所属网格">
          <template #default="{ row }">
            {{ city?.grid[row.grid_id] }}
          </template>
        </el-table-column>
        <el-table-column prop="leave_days" label="请假天数">
          <template #default="{ row }">
            {{ formatLeaveDuration(row.start_time, row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否批准">
          <template #default="{ row }">
            <el-select
              v-model="row.state"
              style="width: 100px"
              :disabled="row.state !== LeaveRequestState.Pending"
              @change="(newState: LeaveRequestState) => statusChange(row, newState)"
            >
              <el-option
                v-for="option in Object.values(LeaveRequestState).filter(value => typeof value === 'number')"
                :key="option"
                :label="formatLeaveRequestState(option as LeaveRequestState)"
                :value="option"
              />
            </el-select>
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
            :model="leaveRequestDetail"
            style="max-width: 80%"
            disabled
          >
            <el-form-item label="头像"
            >
              <el-avatar :size="100"
                         :src="leaveRequestDetail.avatarURL ? leaveRequestDetail.avatarURL : BASE_AVATAR_URL" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input :value="leaveRequestDetail.name" />
            </el-form-item>
            <el-form-item label="性别">
              <el-input :value="formatGender(leaveRequestDetail.gender!)" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input :value="leaveRequestDetail.tel" />
            </el-form-item>
            <el-form-item label="开始日期">
              <el-input :value="leaveRequestDetail.start_time" />
            </el-form-item>
            <el-form-item label="结束日期">
              <el-input :value="leaveRequestDetail.end_time" />
            </el-form-item>
            <el-form-item label="请假理由">
              <el-input
                autosize="true"
                type="textarea"
                :value="leaveRequestDetail.reason"
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
