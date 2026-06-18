<script setup lang="ts">
</script>

<template>
    <div class="container">
        <div class="container-top"></div>
        <div class="container-center">
            <div class="container-center-left">
                <div class="container-left-item">menu-item1</div>
                <div class="container-left-item">menu-item2</div>
                <div class="container-left-item">menu-item3</div>
                <div class="container-left-item">menu-item4</div>
                <div class="container-left-item">menu-item5</div>
                <div class="container-left-item">menu-item6</div>
                <div class="container-left-item">menu-item7</div>
                <div class="container-left-item">menu-item8</div>
                <div class="container-left-item">menu-item9</div>
                <div class="container-left-item">menu-item10</div>
                <div class="container-left-item">menu-item11</div>
                <div class="container-left-item">menu-item12</div>
                <div class="container-left-item">menu-item13</div>
                <div class="container-left-item">menu-item14</div>
                <div class="container-left-item">menu-item15</div>
                <div class="container-left-item">menu-item16</div>
            </div>
            <div class="container-center-right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .container-top {
        width: 100%;
        height: 60px;
        flex-shrink: 0;
        // background-color: #242f42;
        background: #059669;
    }
    .container-center {
        flex: 1;
        display: flex;
        flex-shrink: 0;
        height: calc(100vh - 60px);
        .container-center-left {
            width: 200px;
            height: 100%;
            flex-shrink: 0;
            overflow-y: auto;
            background: #34d399;
            .container-left-item {
                height: 56px;
                text-align: center;
                line-height: 56px;
                font-size: 18px;
                color: white;
            }
        }
        .container-center-right {
            padding: 20px;
            flex-shrink: 0;
            flex:1;
            height: 100%;
            overflow-y: auto;
        }
    }
}
::-webkit-scrollbar { display: none; } 
</style>
