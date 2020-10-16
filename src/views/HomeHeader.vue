<template>
    <div id="header">
        <div id="search">
            <a-input-search placeholder="搜索歌曲/歌手" size="default" allow-clear @search="onSearch()" v-model="search"/>
        </div>
    </div>
</template>

<script>
    export default {
        name:"HomeHeader",
        data() {
            return {
                search:'',
            }
        },
        methods:{
            onSearch() {
                let _this = this; //存储this的指向，相当于初始化this的数据
                _this.$router.push({
                    path: '/musicList',
                    query:{keyword:_this.search}
                });
            }
        }
    }
</script>

<style>
    #search {
        width: 40%;
    }
</style>
