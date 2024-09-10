<template>
  <div>
    <div style="font-family: sai; font-size: 60px; border-left: 10px dashed aqua; margin: 2vh; padding: 0vh 0vw;">
      请选择你要新增的市场
    </div>
    <div>
      <table style="font-family: sai; font-size: 30px; border: 1px solid rgb(0, 255, 255); border-radius: 5px; width: -webkit-fill-available; margin: 3% 2%; padding: 0% 2%;">
        <tbody id="page7tbody" style="display: flex; flex-direction: column;"></tbody>
      </table>
    </div>
    <!-- <button @click='next'>下一步</button> -->
  </div>
</template>

<script>
import useStore from '@/config/store'
import axios from 'axios';

export default {
  props: {
    nextClick: Number
  },
  mounted() {
    wife.doAction("伸右手说话");
    let signSucc = new Audio()
     signSucc.src = require("../asset/video/8.wav")
     signSucc.play()
    const tbody = document.getElementById('page7tbody');
    ["深A", "沪A", "京A/股转A", "股转B", "深基金", "沪基金"].forEach((item, index) => {
      const div = document.createElement('div');
      div.id = `page7tr${index}`;
      div.style = `padding: 4% 0%; ${index === 5 ? "" : "border-bottom: 1px dashed aqua;"} display: flex; flex-direction: row; align-items: center;`;
      div.innerHTML = `
        <input id="page7tr${index}choose" type="radio" value="${index}" name="market" style="zoom: 2;">
        <div style="padding: 0vh 1vw; text-align: justify; width: 18vw; display: inline-block; text-align-last: justify; text-wrap: nowrap;">
          ${item}
        </div>
        <button id="page7tr${index}button1" style="bottom: auto; right: auto; text-align: justify; text-wrap: nowrap; width: 15vw; margin: 0vh 2vw; font-family: sai; font-size: 25px;">
          新开证券账户
        </button>
        <button id="page7tr${index}button2" disabled style="text-wrap: nowrap; bottom: auto; right: auto; text-align: justify; width: 15vw; margin: 0vh 2vw; font-family: sai; font-size: 25px;">
          使用已有账户
        </button>
        <input id="page7tr${index}stk" value="" title="证券账户" disabled style="text-wrap: nowrap; width: 15vw; font-family: sai; font-size: 25px;">
      `;
      tbody.appendChild(div);
    });

    const API_BASE_URL = 'http://47.121.189.158:8081';
    const data = { userId: "1" };

    fetch(API_BASE_URL + '/security/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(res => {
        if (res.code === '666') {
          localStorage.setItem("page7data", JSON.stringify(res.data));

          res.data.stks.forEach(item => {
            const element = document.getElementById(`page7tr${item.stkMarket}`);
            if (element) {
              document.getElementById(`page7tr${item.stkMarket}button1`).disabled = true;
              document.getElementById(`page7tr${item.stkMarket}button2`).disabled = false;
              document.getElementById(`page7tr${item.stkMarket}stk`).value = item.stkId;
            }
          });
        }
      });
  },
  methods: {
    next() {
      const API_BASE_URL = 'http://47.121.189.158:8081';
      const pam = {
        userId: "1",
        stks: []
      };

      for (let i = 0; i < 6; i++) {
        const choose = document.getElementById(`page7tr${i}choose`);
        if (choose.checked) {
          pam.stks.push({
            stkId: document.getElementById(`page7tr${choose.value}stk`).value,
            acctBind: "1",
            stkMarket: choose.value
          });
        }
      }

      if (pam.stks.length > 0) {
        fetch(API_BASE_URL + '/security/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pam)
        })
          .then(response => response.json())
          .then(res => {
            // location.href = "/#/8";
          });
      } else {
        alert("请您选择证券市场");
      }
    }
  },
  watch: {
    nextClick: {
      handler(newVal, oldVal) {
        this.$emit('approve', 'ok');
      },
      deep: true
    }
  }
};
</script>
