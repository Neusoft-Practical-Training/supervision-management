<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { AqiFeedbackState, TaskCompletedState } from '@/common/enums'
import { assignments, confirms, feedbacks, gridMembers } from '@/common/testData'
import type { UserDTO } from '@/api/entities/user'
import { type AreaInfo, findAreaById, formatDate, formatTaskCompletedState, formatUseTime } from '@/util'
import { useUserStore } from '@/stores'
import {
  assignCrossDomainAccept, assignCrossDomainDeny,
  getConfirmDetail,
  getCrossDomainAssignments,
  getFeedback,
  getGridMembersByGridId, selectCrossDomainAssignments,
} from '@/api'
import type { AqiFeedback } from '@/api/entities/feedback'
import { aqi } from '@/common/aqi'
import { CircleCloseFilled, Location, OfficeBuilding, Tickets, Timer, User } from '@element-plus/icons-vue'
import MapComponent from '@/components/map/MapComponent.vue'
import type { AqiAssignment } from '@/api/entities/assign'
import type { AqiStatistics } from '@/api/entities/confirm'

const showData = ref<AqiAssignment[]>()
const city = ref<AreaInfo>()
const currentUser: UserDTO = useUserStore().user!
const currentPage = ref<number>()
const dateRange = ref<string[]>(['', ''])
const feedbackDetail = ref<AqiFeedback>()
const assignDetail = ref<AqiAssignment>()
const confirmDetail = ref<AqiStatistics>()
const selectedGrid = ref<string>(currentUser.grid_id!)
const candidates = ref<UserDTO[]>()

// view detail
const drawerVisible = ref<boolean>(false)
const viewDetail = async (row: AqiAssignment) => {
  assignDetail.value = row
  drawerVisible.value = true
  try {
    feedbackDetail.value = await getFeedback(assignDetail.value.af_id)
  } catch (err) {
    console.log('Failed to get feedback', err)
    feedbackDetail.value = feedbacks.filter(feedback => feedback.af_id === assignDetail.value!.af_id)[0]
  }
  if (assignDetail.value.completed === TaskCompletedState.CrossDomainRequestCompleted) {
    try {
      confirmDetail.value = await getConfirmDetail(assignDetail.value.as_id!)
    } catch (err) {
      console.error('Failed to get confirmation details:', err)
      confirmDetail.value = confirms.filter(confirm => confirm.as_id === assignDetail.value!.as_id)[0]
    }
  }
}

// assign
const assignBoxVisible = ref<boolean>(false)
const viewAssignDialog = async (row: AqiAssignment) => {
  assignDetail.value = row
  assignBoxVisible.value = true
  try {
    feedbackDetail.value = await getFeedback(assignDetail.value.af_id)
  } catch (err) {
    console.log('Failed to get feedback', err)
    feedbackDetail.value = feedbacks.filter(feedback => feedback.af_id === assignDetail.value!.af_id)[0]
  }
}
const closeAssignDialog = () => {
  assignDetail.value!.completed = TaskCompletedState.CrossDomainRequesting
  assignBoxVisible.value = false
}
const handleGridChange = async () => {
  try {
    candidates.value = await getGridMembersByGridId(selectedGrid.value)
  } catch (err) {
    console.log('Failed to get grid members By grid id:', err)
    candidates.value = gridMembers.filter(gm => gm.grid_id === selectedGrid.value)
  }
}
const assignConfirm = async () => {
  if (assignDetail.value?.completed === TaskCompletedState.CrossDomainRequesting) {
    assignBoxVisible.value = false
    return
  }
  try {
    if (assignDetail.value?.completed === TaskCompletedState.CrossDomainRequestAccepted) {
      await assignCrossDomainAccept(assignDetail.value!)
    } else {
      await assignCrossDomainDeny(assignDetail.value!)
    }
  } catch (err) {
    console.log('Failed to confirm cross domain assignment', err)
  }
  if (assignDetail.value?.completed === TaskCompletedState.CrossDomainRequestAccepted) {
    assignDetail.value!.assign_date = formatDate(new Date())
    assignDetail.value!.assign_time = new Date().toTimeString().split(' ')[0]
  }
  assignBoxVisible.value = false
}

export type SearchCrossDomainAssignmentCondition = {
  keywords?: string,
  state?: TaskCompletedState,
  startDate?: string,
  endDate?: string,
}

// search box data
const searchCondition = ref<SearchCrossDomainAssignmentCondition>({
  keywords: '',
  state: undefined,
  startDate: '',
  endDate: '',
})

const clear = () => {
  searchCondition.value = {
    keywords: '',
    state: undefined,
    startDate: '',
    endDate: '',
  }
  dateRange.value = ['', '']
}

// 使用 watch 监听 dateRange 的变化，并更新 searchCondition
watch(dateRange, (newRange) => {
  [searchCondition.value.startDate, searchCondition.value.endDate] = newRange
})

onBeforeMount(async () => {
  city.value = findAreaById(currentUser.city_id!)
  try {
    showData.value = await getCrossDomainAssignments(currentUser.user_id!)
  } catch (err) {
    console.log('Failed to get cross domain assignments', err)
    showData.value = assignments.filter(assignment => assignment.completed > TaskCompletedState.Completed)
  }
})

const handleQuery = async () => {
  try {
    showData.value = await selectCrossDomainAssignments({
      adminId: currentUser.user_id!,
      condition: searchCondition.value
    })
  } catch (err) {
    console.log('Failed to select feedbacks', err)
    query()
  }
}

const query = () => {
  showData.value = assignments.filter((item) => {
    if (item.completed < TaskCompletedState.CrossDomainRequesting) {
      return false
    }
    // keywords
    if (searchCondition.value.keywords) {
      if (!item.address.includes(searchCondition.value.keywords)) {
        return false
      }
    }
    // state
    if (searchCondition.value.state !== undefined) {
      if (searchCondition.value.state !== item.completed) {
        return false
      }
    }
    // startDate
    if (searchCondition.value.startDate && searchCondition.value.startDate !== '') {
      if (new Date(searchCondition.value.startDate) > new Date(item.assign_date!)) {
        return false
      }
    }
    // endDate
    if (searchCondition.value.endDate && searchCondition.value.endDate !== '') {
      if (new Date(searchCondition.value.endDate) < new Date(item.assign_date!)) {
        return false
      }
    }
    return true
  })
}

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
</script>

<template>
  <div>
    <div class="search">
      <el-form :inline="true" :model="searchCondition" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="searchCondition.keywords" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchCondition.state" clearable style="width: 100px">
            <el-option
              v-for="option in Object.values(TaskCompletedState).filter(value => typeof value === 'number' && value > TaskCompletedState.Completed)"
              :key="option"
              :label="formatTaskCompletedState(option as TaskCompletedState)"
              :value="option"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期区间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
          />
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
        <el-table-column prop="aa_id" label="任务单号" width="80" />
        <el-table-column prop="af_id" label="反馈单号" width="80" />
        <el-table-column prop="supervisor_id" label="监督员ID" width="80" />
        <el-table-column prop="grid_id" label="所属网格">
          <template #default="{ row }">
            {{ city?.grid[row.grid_id] }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="详细地址" />
        <el-table-column prop="completed" label="请求状态">
          <template #default="{ row }">
            <el-tag>{{ formatTaskCompletedState(row.completed) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assign_date" label="指派时间" />
        <el-table-column prop="assign_date" label="距今/天">
          <template #default="{ row }">
            {{ formatUseTime(row.assign_date) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">
              详情
            </el-button>
            <el-button link type="primary" size="small" :disabled="!(row.completed === TaskCompletedState.CrossDomainRequesting)"
                       @click="viewAssignDialog(row)">
              指派
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-count="Math.ceil(showData!.length / 10)"
                     :current-page="currentPage" />
    </div>

    <!-- assign dialog -->
    <div class="assign-dialog">
      <el-dialog v-model="assignBoxVisible" title="指派任务">
        <el-descriptions
          class="margin-top"
          title="反馈信息"
          :column="3"
          size="small"
          border
          v-if="feedbackDetail"
        >
          <div class="feedback-descriptions">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <User />
                  </el-icon>
                  反馈人ID
                </div>
              </template>
              {{ feedbackDetail!.supervisor_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <timer />
                  </el-icon>
                  反馈时间
                </div>
              </template>
              {{ feedbackDetail!.af_date }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <location />
                  </el-icon>
                  Place
                </div>
              </template>
              {{ city?.grid[feedbackDetail!.grid_id] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  预期空气质量
                </div>
              </template>
              <el-tag size="small">{{ aqi[feedbackDetail!.pre_aqi_id].aqi_explain }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <office-building />
                  </el-icon>
                  地址
                </div>
              </template>
              {{ feedbackDetail!.address }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
        <el-form :model="assignDetail" label-width="150px">
          <el-form-item label="是否接受该请求？" required>
            <el-radio-group v-model="assignDetail!.completed">
              <el-radio :label="TaskCompletedState.CrossDomainRequestAccepted">是</el-radio>
              <el-radio :label="TaskCompletedState.CrossDomainRequestDenied">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="assignDetail!.completed === TaskCompletedState.CrossDomainRequestAccepted">
            <el-form-item label="网格">
              <el-select v-model="selectedGrid" placeholder="请选择网格" clearable @change="handleGridChange">
                <el-option
                  v-for="(name, code) in city!.grid"
                  :key="code"
                  :label="name"
                  :value="code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员">
              <el-select v-model="assignDetail!.gm_id" placeholder="请选择人员" clearable>
                <el-option v-for="person in candidates" :key="person.user_id" :label="person.name"
                           :value="person.user_id" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="assignConfirm">指派</el-button>
            <el-button @click="closeAssignDialog">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <!--  detail drawer  -->
    <el-drawer v-model="drawerVisible" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h2 :id="titleId" :class="titleClass">反馈详情与进度</h2>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </template>
      <template #default v-if="feedbackDetail">
        <MapComponent :city="feedbackDetail!.grid_id"
                      :address="feedbackDetail!.address"
                      :marks="[{position: feedbackDetail!.address, title: feedbackDetail!.address}]"
        />
        <el-descriptions
          class="margin-top"
          title="反馈信息"
          :column="3"
          size="small"
          border
        >
          <div class="feedback-descriptions">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <User />
                  </el-icon>
                  反馈人ID
                </div>
              </template>
              {{ feedbackDetail!.supervisor_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <timer />
                  </el-icon>
                  反馈时间
                </div>
              </template>
              {{ feedbackDetail!.af_date }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <location />
                  </el-icon>
                  Place
                </div>
              </template>
              {{ city?.grid[feedbackDetail!.grid_id] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  预期空气质量
                </div>
              </template>
              <el-tag size="small">{{ aqi[feedbackDetail!.pre_aqi_id].aqi_explain }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <office-building />
                  </el-icon>
                  地址
                </div>
              </template>
              {{ feedbackDetail!.address }}
            </el-descriptions-item>
          </div>
          <div class="assignment-descriptions" v-if="feedbackDetail!.state > AqiFeedbackState.Unassigned">
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <User />
                  </el-icon>
                  指派人ID
                </div>
              </template>
              {{ assignDetail?.admin_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <User />
                  </el-icon>
                  被指派网格员ID
                </div>
              </template>
              {{ assignDetail?.gm_id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <timer />
                  </el-icon>
                  指派时间
                </div>
              </template>
              {{ assignDetail?.assign_date }}
            </el-descriptions-item>
          </div>
          <div class="confirm-descriptions" v-if="feedbackDetail!.state === AqiFeedbackState.Completed">
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <timer />
                  </el-icon>
                  确认时间
                </div>
              </template>
              {{ confirmDetail?.confirm_date }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  确认AQI等级
                </div>
              </template>
              {{ confirmDetail ? aqi[confirmDetail?.confirm_aqi_id].aqi_explain : '' }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  CO等级
                </div>
              </template>
              {{ confirmDetail?.co_level }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  CO浓度
                </div>
              </template>
              {{ confirmDetail?.co_value }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  SO₂等级
                </div>
              </template>
              {{ confirmDetail?.so2_level }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  SO₂浓度
                </div>
              </template>
              {{ confirmDetail?.so2_value }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  SPM等级
                </div>
              </template>
              {{ confirmDetail?.spm_level }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <tickets />
                  </el-icon>
                  SPM浓度
                </div>
              </template>
              {{ confirmDetail?.spm_value }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
        <div class="el-descriptions__title" style="font-size: 14px; margin: 12px">反馈处理进度</div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item
            center
            placement="top"
            :timestamp="feedbackDetail!.af_date"
          >
            <el-card>
              <h4>{{ city?.grid[feedbackDetail!.grid_id] + feedbackDetail!.address }} 空气质量
                {{ aqi[feedbackDetail!.pre_aqi_id].aqi_explain }}</h4>
              <p>{{ feedbackDetail!.supervisor_id }} 号监督员反馈于 {{ feedbackDetail!.af_date }}</p>
            </el-card>
          </el-timeline-item>
          <div v-if="feedbackDetail!.state > AqiFeedbackState.Unassigned">
            <el-timeline-item
              center
              placement="top"
              v-if="assignDetail?.cross_domain"
            >
              <el-card>
                <h4>已向{{ assignDetail?.admin_id }}号管理员发送跨域请求</h4>
                <p>{{ formatTaskCompletedState(assignDetail?.completed) }}</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item
              center
              placement="top"
              :timestamp="assignDetail?.assign_date"
              v-if="assignDetail && (assignDetail?.completed > TaskCompletedState.CrossDomainRequestDenied || assignDetail?.completed < TaskCompletedState.CrossDomainRequesting)"
            >
              <el-card>
                <h4>已指派{{ assignDetail?.gm_id }}号网格员前往</h4>
                <p>指派于 {{ assignDetail?.assign_date }}</p>
              </el-card>
            </el-timeline-item>
          </div>
          <el-timeline-item
            center
            placement="top"
            :timestamp="confirmDetail?.confirm_date"
            v-if="feedbackDetail!.state === AqiFeedbackState.Completed"
          >
            <el-card>
              <h4>{{ confirmDetail?.gm_id }}号网格员已确认</h4>
              <p>确认于 {{ confirmDetail?.confirm_date }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>