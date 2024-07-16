<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { AqiFeedbackState, TaskCompletedState } from '@/common/enums'
import { assignments, confirms, feedbacks, gridMembers } from '@/common/testData'
import type { UserDTO } from '@/api/entities/user'
import {
  type AreaInfo,
  findAreaById,
  formatAqiFeedbackState,
  formatDate,
  formatTaskCompletedState,
  formatUseTime
} from '@/util'
import { useUserStore } from '@/stores'
import {
  assignCommon,
  assignCrossDomainRequest,
  getConfirmDetail,
  getFeedbacks,
  getGridMembersByGridId,
  getTask,
  selectFeedbacks
} from '@/api'
import type { AqiFeedback } from '@/api/entities/feedback'
import { aqi } from '@/common/aqi'
import { CircleCloseFilled, Location, OfficeBuilding, Tickets, Timer, User } from '@element-plus/icons-vue'
import MapComponent from '@/components/map/MapComponent.vue'
import type { AqiAssignment } from '@/api/entities/assign'
import type { AqiStatistics } from '@/api/entities/confirm'

const showData = ref<AqiFeedback[]>()
const city = ref<AreaInfo>()
const currentUser: UserDTO = useUserStore().user!
const currentPage = ref<number>()
const dateRange = ref<string[]>(['', ''])
const feedbackDetail = ref<AqiFeedback>()
const assignDetail = ref<AqiAssignment>()
const confirmDetail = ref<AqiStatistics>()
const assignment = ref<AqiAssignment>()
const selectedCity = ref<string>(currentUser.city_id!)
const selectedGrid = ref<string>(currentUser.grid_id!)
const candidates = ref<UserDTO[]>()

// view detail
const drawerVisible = ref<boolean>(false)
const viewDetail = async (row: AqiFeedback) => {
  feedbackDetail.value = row
  drawerVisible.value = true
  // 假设状态是 Assigned
  if (feedbackDetail.value.state === AqiFeedbackState.Assigned) {
    try {
      assignDetail.value = await getTask(feedbackDetail.value.aa_id!)
    } catch (err) {
      console.error('Failed to get task details:', err)
      assignDetail.value = assignments.filter(assignment => assignment.aa_id === feedbackDetail.value!.aa_id!)[0]
    }
  }
  // 假设状态是 Completed
  else if (feedbackDetail.value.state === AqiFeedbackState.Completed) {
    try {
      assignDetail.value = await getTask(feedbackDetail.value.aa_id!)
      if (assignDetail.value?.as_id) {
        try {
          confirmDetail.value = await getConfirmDetail(assignDetail.value.as_id)
        } catch (err) {
          console.error('Failed to get confirmation details:', err)
          confirmDetail.value = confirms.filter(confirm => confirm.as_id === assignDetail.value!.as_id)[0]
        }
      }
    } catch (err) {
      console.error('Failed to get task details for completed feedback:', err)
      assignDetail.value = assignments.filter(assignment => assignment.aa_id === feedbackDetail.value!.aa_id!)[0]
      confirmDetail.value = confirms.filter(confirm => confirm.as_id === assignDetail.value!.as_id)[0]
    }
  }
}

// assign
const assignBoxVisible = ref<boolean>(false)
const viewAssignDialog = (row: AqiFeedback) => {
  feedbackDetail.value = row
  assignBoxVisible.value = true
  assignment.value = {
    address: feedbackDetail.value!.address!,
    admin_id: currentUser.user_id!,
    af_id: feedbackDetail.value!.af_id!,
    completed: TaskCompletedState.Uncompleted,
    cross_domain: false,
    grid_id: feedbackDetail.value!.grid_id,
    supervisor_id: feedbackDetail.value!.supervisor_id
  }
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
  if (assignment.value?.cross_domain) {
    await crossDomainAssign()
  } else {
    await commonAssign()
  }
}

const crossDomainAssign = async () => {
  try {
    const newAssignment: AqiAssignment = await assignCrossDomainRequest({
      city_id: selectedCity.value,
      assignment: assignment.value!
    })
    feedbackDetail.value!.aa_id = newAssignment.aa_id
    feedbackDetail.value!.state = AqiFeedbackState.Assigned
  } catch (err) {
    console.log('Failed to cross domain assign:', err)
    assignment.value!.aa_id = assignments.length
    assignment.value!.completed = TaskCompletedState.CrossDomainRequesting
    assignment.value!.assign_date = formatDate(new Date())
    assignment.value!.assign_time = new Date().toTimeString().split(' ')[0]
    assignments.push(assignment.value!)
    feedbackDetail.value!.aa_id = assignment.value!.aa_id
    feedbackDetail.value!.state = AqiFeedbackState.Assigned
  }
  assignBoxVisible.value = false
}

const commonAssign = async () => {
  try {
    const newAssignment: AqiAssignment = await assignCommon(assignment.value!)
    feedbackDetail.value!.aa_id = newAssignment.aa_id
    feedbackDetail.value!.state = AqiFeedbackState.Assigned
  } catch (err) {
    console.log('Failed to assign:', err)
    assignment.value!.aa_id = assignments.length
    assignment.value!.completed = TaskCompletedState.Uncompleted
    assignment.value!.assign_date = formatDate(new Date())
    assignment.value!.assign_time = new Date().toTimeString().split(' ')[0]
    assignments.push(assignment.value!)
    feedbackDetail.value!.aa_id = assignment.value!.aa_id
    feedbackDetail.value!.state = AqiFeedbackState.Assigned
  }
  assignBoxVisible.value = false
}

export type SearchFeedbackCondition = {
  keywords?: string,
  grid_id?: string,
  state?: AqiFeedbackState,
  startDate?: string,
  endDate?: string,
  aqi?: number,
}

// search box data
const searchCondition = ref<SearchFeedbackCondition>({
  keywords: '',
  grid_id: '',
  state: undefined,
  startDate: '',
  endDate: '',
  aqi: undefined
})

const clear = () => {
  searchCondition.value = {
    keywords: '',
    grid_id: '',
    state: undefined,
    startDate: '',
    endDate: '',
    aqi: undefined
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
    showData.value = await getFeedbacks(currentUser.user_id!)
  } catch (err) {
    console.log('Failed to get feedbacks', err)
    showData.value = feedbacks
  }
})

const handleQuery = async () => {
  try {
    showData.value = await selectFeedbacks({
      adminId: currentUser.user_id!,
      condition: searchCondition.value
    })
  } catch (err) {
    console.log('Failed to select feedbacks', err)
    query()
  }
}

const query = () => {
  showData.value = feedbacks.filter((item) => {
    // keywords
    if (searchCondition.value.keywords) {
      if (!item.address.includes(searchCondition.value.keywords)) {
        return false
      }
    }
    // grid
    if (searchCondition.value.grid_id) {
      if (!item.grid_id.includes(searchCondition.value.grid_id)) {
        return false
      }
    }
    // state
    if (searchCondition.value.state !== undefined) {
      if (searchCondition.value.state !== item.state) {
        return false
      }
    }
    // aqi
    if (searchCondition.value.aqi != undefined) {
      if (searchCondition.value.aqi !== item.pre_aqi_id) {
        return false
      }
    }
    // startDate
    if (searchCondition.value.startDate && searchCondition.value.startDate !== '') {
      if (new Date(searchCondition.value.startDate) > new Date(item.af_date!)) {
        return false
      }
    }
    // endDate
    if (searchCondition.value.endDate && searchCondition.value.endDate !== '') {
      if (new Date(searchCondition.value.endDate) < new Date(item.af_date!)) {
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
        <el-form-item label="预期AQI">
          <el-select v-model="searchCondition.aqi" clearable style="width: 100px">
            <el-option
              v-for="option in aqi"
              :key="option.aqi_id"
              :label="option.aqi_explain"
              :value="option.aqi_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchCondition.state" clearable style="width: 100px">
            <el-option
              v-for="option in Object.values(AqiFeedbackState).filter(value => typeof value === 'number')"
              :key="option"
              :label="formatAqiFeedbackState(option as AqiFeedbackState)"
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
        <el-table-column prop="af_id" label="反馈单号" width="80" />
        <el-table-column prop="supervisor_id" label="监督员ID" width="80" />
        <el-table-column prop="pre_aqi_id" label="预期AQI">
          <template #default="{ row }">
            {{ aqi[row.pre_aqi_id].aqi_explain }}
          </template>
        </el-table-column>
        <el-table-column prop="grid_id" label="所属网格">
          <template #default="{ row }">
            {{ city?.grid[row.grid_id] }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="详细地址" />
        <el-table-column prop="state" label="状态">
          <template #default="{ row }">
            <el-tag>{{ formatAqiFeedbackState(row.state) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="af_date" label="反馈时间" />
        <el-table-column prop="af_date" label="距今/天">
          <template #default="{ row }">
            {{ formatUseTime(row.af_date) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">
              详情
            </el-button>
            <el-button link type="primary" size="small" :disabled="!(row.state === AqiFeedbackState.Unassigned)"
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
        <el-form :model="assignment" label-width="120px">
          <el-form-item label="是否跨域请求？">
            <el-radio-group v-model="assignment!.cross_domain">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="assignment!.cross_domain" label="跨域请求市">
            <el-select v-model="selectedCity" placeholder="请选择市" clearable>
              <el-option
                v-for="(name, code) in findAreaById(currentUser.province_id!).city"
                :key="code"
                :label="name"
                :value="code"
              />
            </el-select>
          </el-form-item>
          <div v-if="!assignment!.cross_domain">
            <el-form-item label="网格">
              <el-select v-model="selectedGrid" placeholder="请选择网格" clearable @change="handleGridChange">
                <el-option
                  v-for="(name, code) in findAreaById(selectedCity).grid"
                  :key="code"
                  :label="name"
                  :value="code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员">
              <el-select v-model="assignment!.gm_id" placeholder="请选择人员" clearable>
                <el-option v-for="person in candidates" :key="person.user_id" :label="person.name"
                           :value="person.user_id" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="assignConfirm">指派</el-button>
            <el-button @click="assignBoxVisible = false">关闭</el-button>
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
      <template #default>
        <MapComponent :city="feedbackDetail!.grid_id"
                      :address="feedbackDetail!.address"
                      :marks="[{position: feedbackDetail!.address, title: feedbackDetail!.address}]" />
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