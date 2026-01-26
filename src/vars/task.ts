import type { TableColumn } from '@/types/table';

export const columns: TableColumn[] = [
    { id: 1, key: 'name', title: '任务名称' },
    { id: 2, key: 'desc', title: '描述' },
    { id: 3, key: 'status', title: '状态'},
    { id: 4, key: 'start_time', title: '上次执行开始时间' },
    { id: 5, key: 'end_time', title: '上次执行结束时间' },
    { id: 6, key: 'duration', title: '上次执行持续时间' },
    {id: 7, key: 'next_time', title: '下次执行时间' },
];

export const historyColumns: TableColumn[] = [
    { id: 3, key: 'start_time', title: '开始时间' },
    { id: 4, key: 'end_time', title: '结束时间' },
    { id: 5, key: 'duration', title: '持续时间' },
    { id: 6, key: 'status', title: '状态' },
    { id: 7, key: 'error', title: '错误信息' },
];