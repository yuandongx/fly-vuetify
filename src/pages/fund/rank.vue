<template>
    <fund-table data-source-path="/api/fund/rank" :data-headers="fundRankHeader"></fund-table>
</template>
<script setup lang="ts">
import { fundRankHeader } from '@/vars/fund'
</script>