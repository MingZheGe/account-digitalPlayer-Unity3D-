<template>
    <div class="check-cancel">
        <p class="title">销户检查</p>
        <template>
            <ul>
                <li v-for="(list,key) in dataList" :key="key" class="icons">
                <img class='img' :src="getIconName(list.ERR_LEVEL)">
                <span class='text'>{{getText(list.ERR_LEVEL)}}</span>
                    <div class="content-wrap">
                        <span>{{list.ERROR_MSG}}</span>
                    </div>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>

export default {
    props: ["oppBusiData"],
    data() {
        return {
            dataList: [],
            canNext: true
        }
    },
    created() {
        // 1. 禁止 2. 警告 3. 提示
        // 根据禁止项排序
        this.dataList = _.orderBy(this.oppBusiData.forbidenArr || [], ["ERR_LEVEL"], ["asc"])
        let hasForbiden = _.find(this.dataList, item => {
            return item.ERR_LEVEL == "1"
        })
        if (!_.isEmpty(hasForbiden)) {
            this.$emit('change-next', true);
        }
    },
    methods: {
        getIconName(listIconType){
            // 0拒绝办理业务，1禁止办理,2警告，3提示
            switch(listIconType){
            case '0':
                return require('@icons/yinheVTM/customerCheck/icon-refuse.svg');
            case '1':
                return require('@icons/yinheVTM/customerCheck/icon-prohibit.svg');
                break;
            case '2':
                return require('@icons/yinheVTM/customerCheck/icon-warning.svg');
                break;
            case '3':
                return require('@icons/yinheVTM/customerCheck/icon-to-improve.svg');
                break;
            default:
                return require('@icons/yinheVTM/customerCheck/icon-to-improve.svg');
                break;
            }
        },
        getText(listIconType){
            // 0拒绝办理业务，1禁止办理,2警告，3提示
            switch(listIconType){
                case '0':
                    return '拒绝';
                case '1':
                    return '禁止';
                    break;
                case '2':
                    return '警告';
                    break;
                case '3':
                    return '提示';
                    break;
                default:
                    return '提示';
                    break;
            }
        },
    }
}
</script>

<style lang="less">
.check-cancel {
    img{
      width: 66px;
      height: 66px;
    }
    p{
      font-size: 24px;
      color: #FFFFFF;
      font-weight: normal;
      font-stretch: normal;
    }
    .title{
        line-height: 58px;
        font-family: Alibaba PuHuiTi;
        font-weight: bold;
        color: #252525;
        font-size: 42px;
        margin-top: 10px;
        margin-bottom: 24px;
        text-align: center;
    }
    ul{
      background: #FFFFFF;
      border-radius:15px;
      margin-bottom: 100px;
      list-style: none;
      overflow: scroll;
      flex: 2;
      padding: 0;
      width: 100%;
      margin: 0;
      height: auto;
      flex: 0 0 502px;
      li {
        font-size: 24px;
        color: rgba(0,22,51,0.50);
        line-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ebf0ff;
        border-radius: 8px;
        width: 1140px;
        min-height: 100px;
        margin: 0 auto 20px;
        box-sizing: border-box;
        padding: 10px 33px 10px 0;
        
        .content-wrap{
          margin-right: 10px;
          flex: 1 1 auto;
          text-align: left;
          width: 730px;
          span{
            color:#252525;
            font-size:26px;
            line-height:42px;
          }
        }
        button{
            font-family:Alibaba PuHuiTi;
            font-weight: 500;
            width: 215px;
            color: #3b6aff;
            font-size: 26px;
            line-height: 32px;
            border: none;
            background: none;
            padding: 0;
        }
        .text{
            margin-left: 19px;
            margin-right: 32px;
            font-family: Alibaba PuHuiTi;
            font-weight: 500;
            color: #c93e2c;
            font-size: 26px;
            width: 55px;
            line-height: 32px;
        }
        .img{
          width: 26px;
          height: 26px;
          margin: 0 12px 0 50px;
        }
      }
    }
}

</style>