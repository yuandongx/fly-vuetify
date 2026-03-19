<template>
  <v-sheet border rounded>
    <v-data-table-server :headers="headers" :hide-default-footer="dataItems.length < 11" :items="dataItems">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
            监控任务
          </v-toolbar-title>

          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="增加监控任务" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
          @click="reset"></v-btn>
      </template>
    </v-data-table-server>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? '更新' : '增加'}监控任务`" :title="`${isEditing ? '更新' : '增加'}监控任务`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete 
              v-model="formModel.title" 
              auto-select-first
              :items="seleectItems"
               label="选择股票/基金"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formModel.author" label="Author"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select v-model="formModel.genre" :items="['Fiction', 'Dystopian', 'Non-Fiction', 'Sci-Fi']"
              label="Genre"></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-number-input v-model="formModel.year" :max="currentYear" :min="1" label="Year"></v-number-input>
          </v-col>

          <v-col cols="12" md="6">
            <v-number-input v-model="formModel.pages" :min="1" label="Pages"></v-number-input>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="保存" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { onMounted, ref, shallowRef, toRef } from 'vue'

/**
 * 获取当前日期并格式化为 YYYY-MM-DD 格式
 * @returns 格式化后的日期字符串，例如 "2026-03-16"
 */
const get_data = () => {
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
    price: 0.0,
    start_date: get_date(),
    start_price: 0.0,
  }
}

const selectItems = ref([])
const dataItems = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)

const headers = [
  { title: '代码', key: 'code', align: 'start' },
  { title: '名称', key: 'name' },
  { title: '现价', key: 'price' },
  { title: '涨跌', key: 'chang_price', align: 'end' },
  { title: '涨跌幅', key: 'chang_percent', align: 'end' },
  { title: '提醒类别', key: 'notice_type', align: 'end' },
  { title: '提醒价', key: 'notice_price', align: 'end' },
  { title: '关注时价格', key: 'start_price', align: 'end' },
  { title: '关注时间', key: 'start_date', align: 'end' },
  { title: '监控名', key: 'monitor', align: 'end' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  selectItems.value = getSelectItme()
  reset()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id) {
  const found = books.value.find(book => book.id === id)

  formModel.value = {
    id: found.id,
    title: found.title,
    author: found.author,
    genre: found.genre,
    year: found.year,
    pages: found.pages,
  }

  dialog.value = true
}

function remove(id) {
  const index = books.value.findIndex(book => book.id === id)
  books.value.splice(index, 1)
}

function save() {
  if (isEditing.value) {
    const index = books.value.findIndex(book => book.id === formModel.value.id)
    books.value[index] = formModel.value
  } else {
    formModel.value.id = books.value.length + 1
    books.value.push(formModel.value)
  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
}

const getSelectItme = () => {
  return [
    "A(1231)",
    "B(1231)",
    "C(1231)"
  ];
}
const getData = () => {
  return [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960, pages: 281 },
    { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian', year: 1949, pages: 328 },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925, pages: 180 },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', year: 2011, pages: 443 },
    { id: 5, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', year: 1965, pages: 412 },
  ]
}
</script>