通用按钮

<template>
  <div
    :id="field.FIELD_ID" 
     :class="itemClass"
     class="el-form-item"
  >
    <kui-button
      class="use-id-button el-form-item_content"
      :ref="field.FIELD_ID"
      v-if="isShow"
      :options="{
          buttonGroup: buttonGroup
        }"
    ></kui-button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            itemClass: "self-button",
            isDisabled: false,
        }
    },
    props: ["field", "index", "isBaseUI"],
    created() {},
    mounted() {
        this.itemClass += " " + this.field.FIELD_ID;
    },
    computed: {
        fieldButtonTxt: function () {
            return this.field.FIELD_TITLE
        },
        buttonGroup: function() {
            let btnList = [];
            btnList.push({
                text: this.fieldButtonTxt || '确认', 
                handler: this.clickButton,
                disabled: this.isDisabled
                });
            return btnList
        },
        isShow: function() {
            let fieldControl = parseInt(this.field.FIELD_CONTROL);
            if(fieldControl == 2){
                this.isDisabled = true;
            } else {
                this.isDisabled = false;
            }

            if(fieldControl === 0 || fieldControl === 2){
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        validatorField(rule, value, callback) {},
        clickButton() {
            if(this.isBaseUI) {
                this.$emit('click-button')
            } else {
                let data = {};
                data["MODULE_ID"] = this.field.MODULE_ID;
                data["index"] = this.index;
                data["FIELD_ID"] = this.field.FIELD_ID;
                data["GROUP_ID"] = this.$parent.$parent.moduleItem.GROUP_ID;
                this.$store.commit(this.$types.UPDATE_COMPONENT_BUTTON_CLICK, data);
            }
        },
    }
}
</script>

<style lang="less">

</style>
