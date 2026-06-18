<script lang="ts" setup>
    import * as XLSX from 'xlsx';

    const sum:any = 1;
    console.log(sum + 1, 'sum');
    const data = [];

    const downLoad = () => {
        try {
            // 处理数据并生成Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.xlsx';

            // 模拟点击下载链接
            a.click();

            // 释放资源
            URL.revokeObjectURL(url);
        } catch (e: any) {
            console.error(e);
        }
    }

    downLoad();
</script>>
<template>
    <div>{{ sum + 1 }}-{{ sum }}</div>
</template>
<style scoped lang="scss">
</style>