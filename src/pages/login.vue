<!--xx.vue-->
<template>
    <div>{{ this.store.cardData.Name }}
    </div>
</template>
<script>
import useStore from '@/config/store'
export default {
    data() {
        return {
            store:''
        }
    },
 
   mounted() {
    this.store = useStore()
 

  },

}
</script>

  