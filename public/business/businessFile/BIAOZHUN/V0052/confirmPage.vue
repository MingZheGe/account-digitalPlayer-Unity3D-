<template>
  <el-container class="bizConfirmPage">
    <el-main class="openAccountConfirmView">
        <confirm-basic-info-view></confirm-basic-info-view>
    </el-main>
  </el-container>
</template>
<script>
import confirmBasicInfoView from '../../../businessModule/bizConfirm/confirmBaseInfoView'
export default {
    data() {
        return {}
    },
    components: {
        confirmBasicInfoView: confirmBasicInfoView
    },
    methods: {}
}
</script>