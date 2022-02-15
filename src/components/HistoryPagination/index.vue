<template>
    <div class="page-content">
        <div>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[2, 5, 8, 10, 20, 30, 40]"
                :page-size="size"
                layout="prev, pager, next"
                :total="total"
                :small="true"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HistoryPagination',
    props: { // 用来接收父组件传给子组件的数据
        page: Number,
        size: Number,
        total: Number
    },
    data() {
        return {
            currentPage: this.page,
            pageSize: this.size,
            totalNum: this.total
        }
    },
    methods: {
        //处理每页条数改变事件
        handleSizeChange(val) {
            //向父组件传递改变的值
            this.$emit('pagination',{ page: this.page, size: val } )
        },
        //处理当前页数改变事件
        handleCurrentChange(val) {
            //向父组件传递改变的值
            this.$emit('pagination',{ page: val, size: this.size } )
        }
    }
}
</script>

<style lang="scss" scoped>
.page-content {
    position: relative
}
</style>