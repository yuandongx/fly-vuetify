<template>
  <v-sheet border rounded>
    <v-data-table-server :headers="headers" 
    :items-length="dataItemsLength"
    :hide-default-footer="dataItemsLength < 11" :items="dataItems">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
            监控任务
          </v-toolbar-title>
          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="增加监控任务" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.notice_rule="{ internalItem, isExpanded, toggleExpand }">
      <v-btn
        :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        :text="isExpanded(internalItem) ? '收起' : '查看'"
        class="text-none"
        color="medium-emphasis"
        size="small"
        variant="text"
        width="105"
        @click="toggleExpand(internalItem)"
      ></v-btn>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" class="py-2">
          <v-sheet rounded="lg" border>
            <v-table density="compact">
              <tbody class="bg-surface-light">
                <tr>
                  <th>提醒类型</th>
                  <th>提醒策略</th>
                  <th>提醒阈值</th>
                </tr>
              </tbody>

              <tbody>
                <tr v-for="value in item.notice_configs" :key="value.key">
                  <td class="py-2">{{ value.notice_type }}</td>
                  <td class="py-2">{{ value.notice_unit }}</td>
                  <td class="py-2">{{ value.notice_value}}</td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </td>
      </tr>
    </template>

      <template v-slot:item.name="{ item }">
        <NameCell :value="item.name"></NameCell>
      </template>

      <template v-slot:item.actions="{ item }">
        <TableActions :id="item.id" @edit="edit" @delete="remove"></TableActions>
      </template>

      <!-- <template v-slot:no-data>
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border @click="reset"></v-btn>
      </template> -->  
    </v-data-table-server>
  </v-sheet>

  <TaskDialog 
    v-model="dialog"
    :is-editing="isEditing"
    :form-data="formModel"
    :stock-items="selectItems"
    @save="save"
    @add-notice="addNoticeConfig"
    @remove-notice="removeNoticeConfig"></TaskDialog>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import { post, get } from '@/http/common'
import { monitorApi } from '@/http/api'
/**
 * 获取当前日期并格式化为 YYYY-MM-DD 格式
 */
const get_date = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createNewRecord() {
  return {
    code: '',
    name: '',
    stock: null,
    noticeConfigs: [
      { noticeType: 'rise', noticeUnit: 'percent', noticeValue: 5 }
    ],
    start_date: get_date(),
    start_price: 0.0,
  }
}

const selectItems = ref([])
const dataItems = ref([])
const dataItemsLength = ref(0)
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = ref(false)
let intervalId = undefined

const headers = [
  { title: '代码', key: 'code', align: 'start' },
  { title: '名称', key: 'name' },
  { title: '现价', key: 'price' },
  { title: '涨跌', key: 'chang_price', align: 'end' },
  { title: '涨跌幅', key: 'chang_percent', align: 'end' },
  { title: '提醒策略', key: 'notice_rule', align: 'end' },
  // { title: '提醒价', key: 'notice_price', align: 'end' },
  { title: '关注时价格', key: 'start_price', align: 'end' },
  { title: '关注时间', key: 'start_date', align: 'end' },
  // { title: '监控名', key: 'monitor', align: 'end' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  selectItems.value = getSelectItme()
  reset()
  getDataItems()
  intervalId = setInterval(() => {
    getDataItems()
  }, 5000)
})
onUnmounted(()=>{
  if(intervalId) {
    clearInterval(intervalId)
  }
})
function add() {
  formModel.value = createNewRecord()
  isEditing.value = false
  dialog.value = true
}

function edit(id) {
  const found = dataItems.value.find(item => item.id === id)
  formModel.value = {
    ...found,
    stock: { code: found.code, name: found.name },
    noticeConfigs: found.noticeConfigs?.length 
      ? [...found.noticeConfigs] 
      : [...createNewRecord().noticeConfigs],
  }
  isEditing.value = true
  dialog.value = true
}

function remove(id) {
  const index = dataItems.value.findIndex(item => item.id === id)
  dataItems.value.splice(index, 1)
}

function save() {
  if (!formModel.value.stock) {
    alert('请选择股票/基金')
    return
  }

  const submitData = {
    code: formModel.value.stock.code,
    name: formModel.value.stock.name,
    notice_configs: formModel.value.noticeConfigs.map((config, index) => ({
      id: `${index + 1}`,
      notice_type: config.noticeType,
      notice_unit: config.noticeUnit,
      notice_value: config.noticeValue,
    })),
    start_date: formModel.value.start_date,
    start_price: formModel.value.start_price,
  }

  if (formModel.value.id) {
    submitData.id = formModel.value.id
    const index = dataItems.value.findIndex(item => item.id === formModel.value.id)
    dataItems.value[index] = { ...formModel.value, ...submitData }
  } else {
    submitData.id = `${dataItems.value.length + 1}`
    dataItems.value.push({ ...formModel.value, ...submitData })
  }
  post(monitorApi.monitor, submitData)
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
}

function addNoticeConfig() {
  if (formModel.value.noticeConfigs.length < 3) {
    formModel.value.noticeConfigs.push({ noticeType: 'rise', noticeUnit: 'percent', noticeValue: 5 })
  }
}

function removeNoticeConfig(index) {
  if (formModel.value.noticeConfigs.length > 1) {
    formModel.value.noticeConfigs.splice(index, 1)
  }
}
const getDataItems = async () => {
  const data = await get(monitorApi.monitor)
  if (data.code == 0) {
    dataItems.value = data.data.items
    dataItemsLength.value = data.data.total
  }
}
const getSelectItme = () => {
  return [
    { code: '000001', name: '平安银行' },
    { code: '000002', name: '万科A' },
    { code: '600000', name: '浦发银行' },
    { code: '600519', name: '贵州茅台' },
    { code: '000858', name: '五粮液' },
    { code: '159001', name: '货币基金A' },
    { code: '510300', name: '沪深300ETF' },
  ]
}
</script>