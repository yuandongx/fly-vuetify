<template>
    <fund-table data-source-path="/api/fund/all" :data-headers="fundAllHeader"></fund-table>
</template>
<script setup lang="ts">
import { fundAllHeader } from '@/vars/fund'

</script>