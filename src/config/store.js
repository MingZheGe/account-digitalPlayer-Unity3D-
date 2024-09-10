//store.js
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', {
    state: () => ({ count: 0,
        cardData: null,
     }),
    getters: {
      double: (state) => state.count * 2,
    },
    actions: {
      increment() {
        this.count++
      },
      set(cou){
        this.count = cou
      },
      setCardData(data) {
        this.cardData = data;
      }
    },
  })

export default useStore;
