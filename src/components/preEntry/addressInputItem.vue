  地址输入框，包含国家，省，市，街道等分段输入框

<template>
  <div
   :id="field.FIELD_ID"
   :class="itemClass + ' ' + field.FIELD_ID"
   v-show="isShow"
  >
    <kui-addressbox
      :ref="field.FIELD_ID"
      :options="{
        isShowCountry: showCountry,
        required: isRequired,
        title: title,
        validType: field.VALID_TYPE,
        isShowUseIdCard: isShowUseIDAddress,
        addrValidType: '',
        addrSrcServiceCode: '',
        showRegion: showRegion,
        valChange: valChange,
        disabled: isDisabled,
        validatorField: validatorField,
        width: field.width,
        labelWidth: field.labelWidth || 200,
        isVertical: field.isVertical === false? false : true,
        onButtonClick: useIDAddress,
        buttonText: fieldButtonTxt
      }"
    ></kui-addressbox>
  </div>
</template>

<script>
import {parseAddress, getCityData} from '../../tools/util'
export default {
  data () {
    return {
      itemClass: "self-addressInput",
      isDisabled: false,
      country: "中国",
      region: [],
      street: "",
      qsName: "",
      addressOptions: []
    }
  },
  props: ["field", "index", "groupId", "isBaseUI"],
  created () {
    this.qsName = this.$bizcfg.getBizConfigName(this.$definecfg.QSJGDM_CONST[this.$basecfg.qsVersion]);
  },
  mounted () {
    //删除地址联动模块 blur的触发 解决BUG-2212-省市区地址输入框，第一次选择时会在点击后回到下拉框的最上方
    let change = this.$refs[this.field.FIELD_ID].$refs.kuiCascader.change;
    this.$refs[this.field.FIELD_ID].$refs.kuiCascader.change = (e) => {
      if (e.type == "blur") {
        return;
      }
      change(e);
    }
    if (this.field.DEFAULT_VALUE) {
      let val = _.cloneDeep(this.field.DEFAULT_VALUE);
      if (this.field.showRegionSelector) {
        let addressTextInfo = parseAddress(val);
        //如果省市区只有两个则自动补充
        addressTextInfo = this.addAddressAll(_.cloneDeep(addressTextInfo));
        this.field.DEFAULT_VALUE = this.addressArrToStr(_.cloneDeep(addressTextInfo));
        let region = addressTextInfo[1] || [];
        region = region.join("");
        this.field.LAST_ADDRESS_REGION = _.cloneDeep(region);
        this.field.newAddressVal = _.cloneDeep(region).replace(/不详|市辖区|辖县/gm, '') + addressTextInfo[2];
        val = this.field.newAddressVal;
      }
      
      this.$refs[this.field.FIELD_ID].setValue(this.field.DEFAULT_VALUE).then( () => {
        this.$refs[this.field.FIELD_ID].$refs.kuiAutocomplete.$refs.validatebox.validate(val);
      });
      
    }
    this.field.addressCode = this.$refs[this.field.FIELD_ID].getZipCode();
    this.$nextTick( () => {
      this.$refs[this.field.FIELD_ID].$refs.kuiAutocomplete.$refs.validatebox.$watch("validateMsg", (newValue, oldValue) => {
        if (newValue.indexOf("必填项") > -1) {
          this.$refs[this.field.FIELD_ID].$refs.kuiAutocomplete.$refs.validatebox.validateMsg = "";
          this.$refs[this.field.FIELD_ID].$refs.kuiAutocomplete.$refs.validatebox.isShowTips = false;
        } else {
          if (newValue && this.field.changeMessage) {
            this.$refs[this.field.FIELD_ID].$refs.kuiAutocomplete.$refs.validatebox.validateMsg = this.field.changeMessage;
          }
        }
      })
      this.$refs[this.field.FIELD_ID].$refs.kuiCascader.$refs.validatebox.$watch("validateMsg", (newValue, oldValue) => {
        if (newValue.indexOf("必填项") > -1) {
          this.$refs[this.field.FIELD_ID].$refs.kuiCascader.$refs.validatebox.validateMsg = "";
          this.$refs[this.field.FIELD_ID].$refs.kuiCascader.$refs.validatebox.isShowTips = false;
        }
      })
    })
  },
  components: {
  },
  computed: {
    fieldButtonTxt: {
      get: function () {
        return this.field.FIELD_BUTTON_TXT;
      },
      set: function () {
      }
    },
    title: function () {
      return _.trim(this.field.FIELD_TITLE) ? this.field.FIELD_TITLE : '';
    },
    isRequired: function () {
      return parseInt(this.field.FIELD_REQUIRED) ? true : false;
    },
    showCountry: function () {
      return this.field.showCountrySelector;
    },
    showRegion: function () {
      return this.field.showRegionSelector;
    },
    isShow: function () {
      let fieldControl = parseInt(this.field.FIELD_CONTROL);
      if (fieldControl == 2) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }

      if (fieldControl === 0 || fieldControl === 2) {
        return true;
      } else {
        return false;
      }
    },
    isShowUseIDAddress: function () {
      return this.field.FIELD_FUNCTION.indexOf("USE_ID_ADDRESS") != -1;
    },
    dataChange: function () {
      return this.field.DEFAULT_VALUE;
    },
    isShowChange: function () {
      return this.field.showchange;
    },
    regionDetail: function () {
      let regionTemp = _.cloneDeep(this.region);
      return _.pullAll(regionTemp, ['不详', '市辖区', '辖县', '省直辖县', '省直辖县级行政区划']);
    }
  },
  methods: {
    validatorField: function (isValidTrue) {
      if (isValidTrue) {
        this.field.correct = true;
        this.field.message = "";
        this.field.showerr = false;
        if (this.isBaseUI) {
          this.$emit('field-change', this.field)
        } else {
          this.$store.commit(this.$types.UPDATE_FIELD_CHANGE, { field_id: this.field.FIELD_ID, module_id: this.field.MODULE_ID, index: this.index });
        }
      } else {
        this.field.correct = false;
        this.field.showerr = true;
        if (_.trim(this.field.DEFAULT_VALUE) === "" && this.isRequired && this.isShow){
          this.field.FIELD_CONTROL = "0";
        }
      }
    },
    //使用证件地址 按钮
    useIDAddress: function () {
      if (this.isBaseUI) {
        this.$emit('use-id-address', this.field)
      } else {
        //更改state的值，触发全局的字段赋值事件
        let data = {};
        data["FIELD_ID"] = this.field.FIELD_ID;
        data["GROUP_ID"] = this.groupId;
        data["MODULE_ID"] = this.field.MODULE_ID;
        data["index"] = "0";
        this.$store.commit(this.$types.UPDATE_COMPONENT_BUTTON_CLICK, data);
      }
      console.log("使用证件地址");
    },
    valChange(val) {
      this.$refs[this.field.FIELD_ID].validate();
      this.field.newAddressVal = this.$refs[this.field.FIELD_ID].getValue();
      this.field.DEFAULT_VALUE = val;
    },
    //数据地址转化位字符串
    addressArrToStr(addressTextInfoarr) {
      addressTextInfoarr = addressTextInfoarr || [];
      let region = addressTextInfoarr[1] || [];
      let street = addressTextInfoarr[2] || "";
      return region.join("") + street;
    },
    //省市区补充完整
    addAddressAll(addressTextInfo) {
      let region = addressTextInfo && addressTextInfo[1] || [];
      let newRegion = [];
      let cityAll = getCityData();
      if (region.length == 1 || region.length == 2) {
        newRegion.push(region[0]);
        let city = _.find(cityAll, {value: region[0]}) || {}
        let cityChildren = city.children || [];
        let fn = (children) => {
          let cityItem = "";
          let childrenItem = [];
          _.each(children, item => {
            if (item.value == "不详") {
              cityItem = item.value;
              childrenItem = item.children || [];
              return false;
            }
            if (["市辖区", "辖县"].indexOf(item.value) > -1 && !cityItem) {
              cityItem = item.value;
              childrenItem = item.children || [];
            }
          })
          cityItem && newRegion.push(cityItem);
          if (!_.isEmpty(childrenItem)) {
            fn(childrenItem)
          }
        }
        if (region.length == 1) {
          fn(cityChildren)
        }
        if (region.length == 2) {
          let twoRegion = region[1] || "";
          _.each(cityChildren, cityItem => {
            let areaChildren = cityItem.children;
            if (cityItem.value == twoRegion) {
              newRegion.push(twoRegion);
              fn(areaChildren);
              return false
            }
            let areaFind = _.find(areaChildren, {value: twoRegion});
            if (!_.isEmpty(areaFind)) {
              newRegion.push(cityItem.value)
              newRegion.push(areaFind.value)
              return false;
            }
          })
        }
        addressTextInfo[1] = newRegion;
      }
      return addressTextInfo;
    }
  },
  watch: {
    showRegion: function (val) {
      this.$refs[this.field.FIELD_ID].addressbox({showRegion: val});
      let newVal = this.$refs[this.field.FIELD_ID].getValue();
      if (val == false) {
        this.$refs[this.field.FIELD_ID].cascaList = [];
        this.$refs[this.field.FIELD_ID].inputAddress = newVal;
      }
      if (val == true) {
        this.$refs[this.field.FIELD_ID].setValue(newVal);
      }
      
    },
    fieldButtonTxt: function (val) {
      this.fieldButtonTxt = val;
    },
    isRequired: function (val) {
      if (val) {
        this.itemClass += " self-addressInput-required";
      } else {
        this.itemClass = this.itemClass.replace(/self-addressInput-required/g, "");
      }
    },
    isShowChange: function (val) {
      if (val) {
        this.itemClass += " self-addressInput-changed";
      } else {
        this.itemClass = this.itemClass.replace(/self-addressInput-changed/g, "");
      }
    },
    country: function (val) {
      if (["中国", "中国台湾", "香港", "澳门"].indexOf(val) != -1) {
        this.field["showRegionSelector"] = true;
      } else {
        this.field["showRegionSelector"] = false;
      }

      this.field.DEFAULT_VALUE = val + this.regionDetail.join('') + this.street;
    },
    street: function (val) {
      if (this.showCountry) {
        this.field.DEFAULT_VALUE = this.country + this.regionDetail.join('') + val;
      } else {
        this.field.DEFAULT_VALUE = this.regionDetail.join('') + val;
      }
    },
    dataChange: function(val) {
      let newVal = _.cloneDeep(val);
      if (this.field.showRegionSelector) {
        let addressTextInfo = parseAddress(val);
        let region = addressTextInfo[1] || [];
        region = region.join("");
        if (region != this.field.LAST_ADDRESS_REGION) {
          this.field.DEFAULT_VALUE = _.cloneDeep(region);
          this.field.LAST_ADDRESS_REGION = _.cloneDeep(region);
          return
        }
      }
      this.field.newAddressVal = this.$refs[this.field.FIELD_ID].getValue();
      
      this.$refs[this.field.FIELD_ID].setValue(newVal) && this.$refs[this.field.FIELD_ID].setValue(newVal).then( () => {
        this.field.newAddressVal = this.$refs[this.field.FIELD_ID].getValue();
        //组件赋值的时候 不触发校验 手动触发 后期如果组件更改 可以去掉
        this.$refs[this.field.FIELD_ID].onBlur();
      });
      this.field.addressCode = this.$refs[this.field.FIELD_ID].getZipCode();
    },
    'field.FIELD_REQUIRED': function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) ? fieldRef.changeRequired(true) : fieldRef.changeRequired(false);
    },
    "field.FIELD_CONTROL": function(val) {
      let fieldRef = this.$refs[this.field.FIELD_ID];
      parseInt(val) == 2? fieldRef.addressbox("setDisabled") : fieldRef.addressbox("setEnabled");
    }
  }
};
</script>

<style lang="less">
.self-addressInput {
  .el-input-group__append {
    color: #fff;
    background: #217fff;
  }
}

</style>
