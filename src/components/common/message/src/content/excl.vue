// 风险测评题互斥
<template>
    <div class="excl-tpl">
        <div class="excl-title">
            {{ exclTitle }}
        </div>
        <div v-for="item in exclArr">
            <div class="excl-item-title">
                {{ item.CELL }}
            </div>
            <div v-for="ansItem in item.CELL_TEXT_ARR">
                <div class="excl-item-ans">
                    {{ ansItem }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: ["exclTitle", "exclArr"]
}
</script>

<style lang="less" scoped>
.excl-tpl {
    width: 930px;
    height: 410px;
    padding-left: 50px;
    font-size: 24px;
    text-align: left;
    line-height: 40px;
    .excl-title {
        font-weight: 700;
        font-size: 28px;
    }
    .excl-item-title {
        color: #2289ff;
        font-weight: 500;
    }
    .excl-item-ans {
        color: #e30200;
        font-size: 20px;
    }
}
</style>