<template>
  <div>
    <ul class="slide-box">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <!--
    <vue-particles style="z-index: 100;" color="#eefb06" :particleopacity="0.7" :particlesNumber="80" shapeType="circle"
      :particleSize="4" linesColor="#eefb06" :linesWidth="1" :lineLinked="true" :lineopacity="0" :linesDistance="0"
      :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
  -->

    <div class="neon">哥布林山洞</div>
    <div id="banner" style="z-index: 999999;">

      <div class="img-list img-wrapper">


        <div class="img-box" id="first-box">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <svg t="1718603818020" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="3044" style="margin-top: 60%;">
                <path
                  d="M994.72 973.44A39.84 39.84 0 0 1 960.8 992H80a39.84 39.84 0 0 1-33.92-18.4 34.4 34.4 0 0 1 0-36.64A40.16 40.16 0 0 1 80 918.24h880a39.84 39.84 0 0 1 34.08 18.4 34.08 34.08 0 0 1 0.64 36.8zM545.44 688a272 272 0 0 1-148 68.64l-96 7.84c-46.24 3.84-71.68 5.92-76.48 5.92a36.96 36.96 0 0 1-26.24-10.72c-12.64-12.48-12.64-12.48-5.12-102.56l8-96a272 272 0 0 1 68.64-148l352-351.2a113.28 113.28 0 0 1 155.84 0l118.88 118.88a109.92 109.92 0 0 1 0 155.36z m299.52-455.2l-118.88-118.88a37.12 37.12 0 0 0-51.84 0l-352 352a195.52 195.52 0 0 0-48 102.24l-8 96-2.56 30.88 30.88-2.56 96-8a196.64 196.64 0 0 0 102.24-48l352-351.04a37.12 37.12 0 0 0 0-51.84z"
                  fill="#cd8fc0" p-id="3045"></path>
              </svg>

            </span>
            <span>修改资料</span>
          </div>
          <!---->
          <img src="./asset/image/first.png" alt="">
        </div>
        <div class="img-box openBiz" id="second-box" @click="goToPage('idlogin')">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <!--
              <svg >
                <use xlink:href="#icon-kaihu"></use>
              </svg>
            -->
              <svg t="1718591844682" class="icon" viewBox="0 0 1405 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="3425" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin-top: 80%;">
                <path
                  d="M982.625565 796.060708H84.061248a5.733019 5.733019 0 0 1-5.594874-5.594873V347.572884h1098.736459V600.93086a233.050658 233.050658 0 0 1 78.466374 0.483508v-517.35312A84.199393 84.199393 0 0 0 1171.60796 0H84.061248A84.199393 84.199393 0 0 0 0 84.061248v706.335514a84.199393 84.199393 0 0 0 84.061248 84.061248h899.255042a233.257875 233.257875 0 0 1-0.690725-78.466374zM78.466374 84.061248a5.733019 5.733019 0 0 1 5.594874-5.594874h1087.546712a5.733019 5.733019 0 0 1 5.594873 5.594874V269.382799H78.466374z"
                  fill="#cd8fc0" p-id="3426"></path>
                <path
                  d="M563.424486 650.248634H283.197302a39.233187 39.233187 0 0 0 0 78.466374h280.227184a39.233187 39.233187 0 0 0 0-78.466374zM972.610051 459.677572H283.197302a39.233187 39.233187 0 0 0 0 78.466374h689.550894a39.233187 39.233187 0 0 0 0-78.466374z"
                  fill="#cd8fc0" p-id="3427"></path>
                <path
                  d="M211.638179 173.786442m-44.828061 0a44.828061 44.828061 0 1 0 89.656121 0 44.828061 44.828061 0 1 0-89.656121 0Z"
                  fill="#cd8fc0" p-id="3428"></path>
                <path
                  d="M368.570927 173.786442m-44.82806 0a44.828061 44.828061 0 1 0 89.656121 0 44.828061 44.828061 0 1 0-89.656121 0Z"
                  fill="#cd8fc0" p-id="3429"></path>
                <path
                  d="M1215.05457 792.330793m-33.638314 0a33.638314 33.638314 0 1 0 67.276628 0 33.638314 33.638314 0 1 0-67.276628 0Z"
                  fill="#cd8fc0" p-id="3430"></path>
                <path
                  d="M1215.05457 792.330793m-33.638314 0a33.638314 33.638314 0 1 0 67.276628 0 33.638314 33.638314 0 1 0-67.276628 0Z"
                  fill="#cd8fc0" p-id="3431"></path>
                <path
                  d="M1215.05457 642.788803a190.571062 190.571062 0 1 0 190.571062 190.571062 190.847352 190.847352 0 0 0-190.571062-190.571062z m78.466374 298.945834a16.784621 16.784621 0 0 1-16.78462-16.78462 61.681754 61.681754 0 1 0-123.294435 0 16.784621 16.784621 0 0 1-33.638314 0 95.38914 95.38914 0 0 1 49.524992-83.508668 67.276627 67.276627 0 1 1 91.590151 0 95.38914 95.38914 0 0 1 49.524992 83.508668 16.853693 16.853693 0 0 1-16.853693 16.853693z"
                  fill="#cd8fc0" p-id="3432"></path>
              </svg>

            </span>
            <h3>开户</h3>
          </div>
          <img src="./asset/image/second.png" alt="">
        </div>
        <div class="img-box" id="third-box">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <svg t="1718603986142" class="icon" viewBox="0 0 1061 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="4416" style="margin-top: 70%;">
                <path
                  d="M517.595628 674.273224c-29.843352 0-53.15847-24.247723-53.15847-53.15847v-43.832422c0-29.843352 24.247723-53.15847 53.15847-53.15847 29.843352 0 53.15847 24.247723 53.15847 53.15847v43.832422c0 29.843352-23.315118 53.15847-53.15847 53.15847z m0-121.238616c-13.056466 0-24.247723 11.191257-24.247723 24.247724v43.832422c0 13.056466 11.191257 24.247723 24.247723 24.247723s24.247723-11.191257 24.247724-24.247723v-43.832422c0-13.056466-10.258652-24.247723-24.247724-24.247724z"
                  fill="#cd8fc0" p-id="4417"></path>
                <path
                  d="M678.936248 393.559199h-13.989071v-40.102004c0-82.069217-66.214936-148.284153-147.351549-148.284153-81.136612 0-147.351548 66.214936-147.351548 148.284153v40.102004h-13.989071c-55.023679 0-98.856102 44.765027-98.856102 98.856102v214.499089c0 55.023679 44.765027 98.856102 98.856102 98.856102h322.681239c55.023679 0 98.856102-44.765027 98.856102-98.856102v-214.499089c0-55.023679-43.832423-98.856102-98.856102-98.856102z m-279.781421-41.034609c0-65.282332 53.15847-119.373406 118.440801-119.373406s118.440801 53.15847 118.440802 119.373406v14.921676c0 13.989071-11.191257 26.112933-26.112933 26.112933H425.26776c-13.989071 0-26.112933-11.191257-26.112933-26.112933v-14.921676z m349.726776 330.142077c0 52.225865-41.967213 94.193078-94.193078 94.193078H380.502732c-52.225865 0-94.193078-41.967213-94.193078-94.193078V516.663024c0-52.225865 41.967213-95.125683 95.125683-95.125683h273.253188c52.225865 0 95.125683 41.967213 95.125683 95.125683v166.003643z"
                  fill="#cd8fc0" p-id="4418"></path>
              </svg>
            </span>

            <h3>修改密码</h3>
          </div>
          <img src="./asset/image/third.png" alt="">
        </div>
        <div class="img-box" id="forth-box">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <svg t="1718604013173" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="5484" style="margin-top: 60%;">
                <path
                  d="M865.568 1023.776l-47.136 0L378.432 1023.776 205.6 1023.776 189.888 1023.776 158.432 1023.776c-51.616 0.32-78.88-42.656-78.56-94.272L79.872 223.04c0.32-51.616 42.656-93.952 94.272-94.272l15.712 0 47.136 0c0 0 6.432-0.256 13.504 0C264.704 129.28 268.288 138.56 268.448 145.92c0.32 16.032 0 8 0 24.96 0 1.984-0.768 19.68-20.704 20.16C235.072 191.36 175.968 192.224 175.968 192.224c-12.288 0.16-31.84 23.104-32 32l0 704c21.12 32.416 4.48 32.16 32 32l64 0 32 0 576 0c27.52 0.16 32.16-20.736 32-32l0-704c0.864-10.528-17.728-32.992-45.248-33.184 0 0-45.728 0.768-58.336 0-16.544-0.992-20.768-7.488-20.8-19.168-0.064-16.416-0.608-7.968 0-24.288 0.352-9.216-2.432-18.304 20.96-18.816 5.76-0.128 10.464 0 10.464 0l47.136 0 15.712 0c51.616 0.32 93.952 42.656 94.272 94.272l0 706.464C944.448 981.12 917.152 1024.096 865.568 1023.776zM760.064 477.888l-256.736 255.808c-15.424 15.36-40.384 15.36-55.808 0l-156.288-155.712c-15.424-15.36-15.424-40.256 0-55.616 15.424-15.36 40.384-15.36 55.808 0l128.384 127.904 228.832-228c15.424-15.36 40.384-15.36 55.808 0C775.488 437.632 775.488 462.528 760.064 477.888zM687.968 192.224l-40.832 0-270.368 0-40.832 0c-17.664 0-32-14.336-32-32s14.336-32 32-32l33.6 0c8.064-71.904 68.352-128 142.4-128s134.336 56.096 142.4 128l33.6 0c17.664 0 32 14.336 32 32S705.632 192.224 687.968 192.224zM511.968 64.224c-26.496 0-48 21.504-48 48s21.504 48 48 48c26.496 0 48-21.504 48-48S538.464 64.224 511.968 64.224z"
                  p-id="5485" fill="#cd8fc0"></path>
              </svg>
            </span>

            <h3>风险测评</h3>
          </div>
          <img src="./asset/image/forth.png" alt="">
        </div>
        <div class="img-box" id="fifth-box">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <svg t="1718604038336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="6572" style="margin-top: 70%;">
                <path
                  d="M511.588352 849.575936c-100.29056 0-200.579072-0.155648-300.869632 0.251904-9.652224 0.04096-13.89568-2.768896-16.18944-11.9808-8.204288-32.935936-13.04576-65.564672 2.19136-97.980416 14.301184-30.420992 38.807552-50.571264 67.024896-66.787328 52.568064-30.212096 109.535232-48.123904 168.753152-59.777024 6.877184-1.35168 9.654272 1.040384 12.97408 6.139904 16.543744 25.440256 33.435648 50.655232 50.204672 75.948032 1.697792 2.555904 3.284992 5.195776 5.128192 7.647232 8.562688 11.388928 14.794752 11.259904 22.695936-0.579584 11.73504-17.580032 23.359488-35.23584 35.0208-52.867072 7.14752-10.807296 14.0288-21.803008 21.59616-32.303104 1.687552-2.336768 6.115328-4.64896 8.68352-4.112384 66.127872 13.836288 129.656832 34.72384 186.660864 72.060928 28.1088 18.41152 50.33984 42.100736 58.591232 75.84768 7.059456 28.860416 1.380352 56.875008-8.736768 84.056064-0.919552 2.476032-7.071744 4.227072-10.807296 4.251648-50.143232 0.27648-100.288512 0.18432-150.43584 0.18432h-152.485888z m0.503808-82.120704c-2.832384-4.071424-4.614144-6.539264-6.299648-9.07264-22.870016-34.351104-45.664256-68.75136-68.616192-103.047168-9.216-13.768704-12.507136-14.852096-28.000256-10.7008-7.231488 1.939456-14.52032 3.69664-21.71904 5.752832-42.766336 12.199936-84.594688 26.832896-121.25184 52.783104-34.711552 24.571904-61.239296 53.78048-52.328448 101.371904 2.983936 15.931392 4.864 18.407424 20.918272 18.407424h543.275008c2.048 0 9.521152-0.221184 11.251712-0.23552 11.96032-0.1024 17.119232-4.284416 18.434048-10.104832 5.287936-24.123392 7.108608-48.996352-10.467328-69.087232-13.103104-14.987264-27.783168-29.323264-44.048384-40.675328-37.564416-26.22464-80.431104-41.37984-124.336128-53.31968-33.49504-9.107456-28.459008-15.024128-50.456576 18.092032-21.85216 32.909312-43.730944 65.804288-66.3552 99.835904zM580.419584 564.688896c-24.73984 17.18272-52.035584 24.631296-81.299456 21.039104-71.892992-8.828928-113.47968-60.028928-128.524288-120.48384-1.726464-6.93248-2.895872-14.01856-4.02432-21.080064-1.411072-8.835072-6.436864-13.029376-15.316992-13.002752-17.750016 0.053248-35.508224-0.33792-53.241856 0.182272-7.194624 0.212992-9.381888-2.58048-10.067968-9.170944-6.690816-64.192512 5.584896-122.99264 49.262592-172.68736 25.851904-29.411328 58.324992-49.403904 95.195136-61.392896 86.44608-28.112896 166.057984-13.766656 236.070912 44.081152 42.784768 35.34848 64.280576 83.042304 68.087808 138.40384 1.531904 22.29248-0.188416 44.486656-8.196096 65.501184-10.307584 27.05408-32.024576 42.692608-57.591808 53.47328-46.5408 19.623936-94.849024 23.801856-144.42496 15.31904-1.867776-0.44032-3.86048-1.124352-6.043648-1.775616-6.72768-2.435072-11.29472-8.165376-8.947712-14.73536 2.250752-6.299648 7.979008-6.529024 12.544-5.974016 6.017024 0.544768 7.755776 1.302528 13.275136 2.050048 40.163328 5.435392 80.095232 4.808704 117.344256-12.767232 45.979648-21.696512 69.912576-59.121664 56.819712-113.358848-18.83136-77.993984-66.920448-130.73408-142.811136-153.141248-81.168384-23.963648-152.680448-1.488896-211.902464 59.236352-23.687168 24.287232-40.691712 52.35712-46.256128 86.048768-2.465792 14.942208-2.060288 30.435328-2.084864 45.68064-0.012288 8.94976 5.707776 13.289472 14.723072 13.172736 8.531968-0.110592 17.065984-0.047104 25.6-0.079872 11.882496-0.043008 16.300032-4.071424 17.999872-16.007168 5.281792-37.12 19.390464-70.490112 45.2608-97.767424 66.983936-70.629376 181.706752-51.593216 225.994752 37.054464 9.003008 18.028544 16.61952 37.79584 18.96448 58.529792-2.996224 0.323584-5.804032 0.292864-8.128512 0.385024-9.728 0.385024-13.848576-1.943552-16.207872-12.638208-7.647232-34.646016-27.303936-62.16704-55.523328-83.380224-45.123584-33.918976-104.28416-27.961344-146.673664 14.39744-69.615616 69.57056-55.414784 192.2048 27.957248 240.873472 15.904768 9.28768 33.091584 14.123008 51.625984 14.036992 23.517184-0.106496 47.030272-0.022528 70.541312-0.022528z"
                  fill="#cd8fc0" p-id="6573"></path>
              </svg>
            </span>
            <h3>联系客服</h3>
          </div>
          <img src="./asset/image/fifth.jpg" alt="">
        </div>
        <div class="img-box" id="sixth-box">
          <div class="info">
            <span style="height: 20%;width: 30%; margin:10%;">
              <svg t="1718604079195" class="icon" viewBox="0 0 1414 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="7665" style="margin-top: 80%;">
                <path
                  d="M827.966706 701.092985a228.908442 228.908442 0 0 1 358.7044-223.063972l-48.703924 79.874435h221.115814l-79.143876-229.395481-40.424257 64.776218a340.927467 340.927467 0 0 0-303.668965-33.605707 327.533888 327.533888 0 0 0-206.504638 340.927467z m0 0"
                  p-id="7666" fill="#cd8fc0"></path>
                <path
                  d="M1414.11843 128.821879A128.821879 128.821879 0 0 0 1285.296552 0H128.821879A128.821879 128.821879 0 0 0 0 128.821879v765.138644A128.821879 128.821879 0 0 0 128.821879 1022.782402h671.383591l-40.667777-95.459691H133.935791a36.527943 36.527943 0 0 1-36.527943-36.527943V409.84352h685.020689A370.88038 370.88038 0 0 1 919.043044 316.575505a352.12937 352.12937 0 0 1 36.284423-11.688941H97.407848V138.075624a36.527943 36.527943 0 0 1 36.527943-36.527943h1144.542211a36.527943 36.527943 0 0 1 36.527943 36.527943V292.223543l97.407848 281.7522h1.948157z"
                  fill="#cd8fc0" p-id="7667"></path>
                <path
                  d="M1290.653983 643.865874a229.395482 229.395482 0 0 1-141.971938 249.85113 232.804756 232.804756 0 0 1-206.017598-19.72509l44.56409-73.055885-237.918668-13.880619 100.573603 236.214031 42.128894-68.429013a316.575505 316.575505 0 0 0 292.223544 29.709394 327.777408 327.777408 0 0 0 206.504637-340.927468H1290.653983z m0 0"
                  p-id="7668" fill="#cd8fc0"></path>
              </svg>
            </span>

            <h3>变更银行</h3>
          </div>
          <img src="./asset/image/sixth.png" alt="">
        </div>
      </div>
    </div>

    <!--
    <div class="btn-group" style="z-index: 200;">
      <button class="last btn">
        <svg t="1686471404424" class="icon left" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2373" width="128" height="128">
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"></path>
        </svg>
      </button>
      <button class="next btn">
        <svg t="1686471404424" class="icon right" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2373" width="128" height="128">
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"></path>
        </svg>
      </button>
    </div>
  -->

    <!--
    <div style="z-index: 300; margin-top:70%;margin-left:40%;">
    <Timmy />
  </div>
-->


  </div>
</template>

<script>
import './asset/icons/iconfont.js'
import Timmy from './test3D.vue'
import digitalPlayer from '../public/digitalPlayer/DigitalPlayer'
export default {
  components: {
     // Timmy

  },
  data() {
    return {
      moveDistance: 0,
      totalLeft: 0,
      n: 0

    }
  },
  methods: {
    goToPage(location) {
      this.$router.push({ path: '/' + location })
    },
    move(radom) {
      /*  --post-spacing: 20px;
  --post-size: 360px; */
      radom = Math.abs(radom)
      const imgListOne = document.querySelector('.img-list')
      const first = document.getElementById('first-box')
      const second = document.getElementById('second-box')

      const third = document.getElementById('third-box')
      // 获取图片类数组，并将其转化为数组
      const forth = document.getElementById('forth-box')

      const fifth = document.getElementById('fifth-box')

      const sixth = document.getElementById('sixth-box')

      let imgBoxList = Array.prototype.slice.call(document.querySelectorAll('.img-list .img-box'))
      const imgBoxCount = imgBoxList.length
      const btnGroup = document.querySelector('.btn-group')
      let animationTime = 2
      let totalLength = 2280
      let oneLength = 380
      let round = this.n
      //  let radom = Math.random(1, 20) * 40
      imgListOne.style.left = this.totalLeft + -1 * radom + "px"
      this.totalLeft = this.totalLeft + -1 * radom
      //console.log("总距离是", this.totalLeft)
      // console.log(Math.abs(this.totalLeft))
      if (Math.abs(this.totalLeft) > totalLength) (console.log("下一轮"))



      if (Math.abs(this.totalLeft) / oneLength >= 1 + 6 * round && Math.abs(this.totalLeft) / oneLength < 2 + 6 * round) {
        console.log("1aaa")


        setTimeout(() => {
          first.style.transform = `translateX(${totalLength * (n + 1)}px)`;
        }, 1000);

      }
      else if (Math.abs(this.totalLeft) / oneLength >= 2 + 6 * round && Math.abs(this.totalLeft) / oneLength < 3 + 6 * round) {
        console.log("2")
        setTimeout(() => {
          first.style.transform = `translateX(${totalLength * (round + 1)}px)`
          second.style.transform = `translateX(${totalLength * (round + 1)}px)`
        }, 1000)

      }
      else if (Math.abs(this.totalLeft) / oneLength >= 3 + 6 * round && Math.abs(this.totalLeft) / oneLength < 4 + 6 * round) {
        console.log("3")
        setTimeout(() => {
          first.style.transform = `translateX(${totalLength * (round + 1)}px)`
          second.style.transform = `translateX(${totalLength * (round + 1)}px)`
          third.style.transform = `translateX(${totalLength * (round + 1)}px)`
        }, 1000)

      }
      else if (Math.abs(this.totalLeft) / oneLength >= 4 + 6 * round && Math.abs(this.totalLeft) / oneLength < 5 + 6 * round) {
        console.log("4")
        setTimeout(() => {
          first.style.transform = `translateX(${totalLength * (round + 1)}px)`
          second.style.transform = `translateX(${totalLength * (round + 1)}px)`
          third.style.transform = `translateX(${totalLength * (round + 1)}px)`
          forth.style.transform = `translateX(${totalLength * (round + 1)}px)`
        }, 1000)

      }
      else if (Math.abs(this.totalLeft) / oneLength >= 5 + 6 * round && Math.abs(this.totalLeft) / oneLength < 6 + 6 * round) {
        console.log("5")
        setTimeout(() => {
          first.style.transform = `translateX(${totalLength * (round + 1)}px)`
          second.style.transform = `translateX(${totalLength * (round + 1)}px)`
          third.style.transform = `translateX(${totalLength * (round + 1)}px)`
          forth.style.transform = `translateX(${totalLength * (round + 1)}px)`
          fifth.style.transform = `translateX(${totalLength * (round + 1)}px)`
        }, 1000)

      }
      else if (Math.abs(this.totalLeft) / oneLength >= 6 + 6 * round && Math.abs(this.totalLeft) / oneLength < 7 + 6 * round) {
        console.log("6里面的n值")
        console.log(round)

        setTimeout(() => {
            first.style.transform = `translateX(${totalLength * (round + 1)}px)`
            second.style.transform = `translateX(${totalLength * (round + 1)}px)`
            third.style.transform = `translateX(${totalLength * (round + 1)}px)`
            forth.style.transform = `translateX(${totalLength * (round + 1)}px)`
            fifth.style.transform = `translateX(${totalLength * (round + 1)}px)`

            sixth.style.transform = `translateX(${totalLength * (round + 1)}px)`
          }, 1000)

        //round++
      }

      this.n = Math.floor((Math.abs(this.totalLeft) / oneLength) / 6)
      console.log("n的值变为")
      console.log(this.n)

      /*    
      console.log("n的值变为")
          console.log(round)
          */



    },


  },
  mounted() {

    this.$nextTick(function () {
      //digitalPlayer.doAction("开心")
      const imgListOne = document.querySelector('.img-list')

      let imgBoxList = Array.prototype.slice.call(document.querySelectorAll('.img-list .img-box'))
      const imgBoxCount = imgBoxList.length
      const btnGroup = document.querySelector('.btn-group')


      let animationTime = 2
      // 初始化数组中元素的的顺序，将最后一张图片放在第一位与html部分图片展示位置一致
      imgBoxList.unshift(imgBoxList.pop())
      // 设置imgListOne动画时间
      imgListOne.style.transition = animationTime + 's ease-out'



      // 设置按钮出现时间
      setTimeout(function () {
        btnGroup.style.opacity = '1'
        btnGroup.style.bottom = '5%'
      }, animationTime * 1000)
      // 点击事件


        //  const root = document.documentElement;
        const root = document.getElementById("banner");


      root.addEventListener("touchstart", function (e) {
        console.log("手指触碰")
      }, { passive: false });
      root.addEventListener('touchmove', (e) => {//在传统函数中，this 的值是动态绑定的，取决于函数的调用方式。例如：在事件处理程序中使用传统函数时，this 通常指向触发事件的 DOM 元素，而不是 Vue 组件实例。箭头函数不会创建自己的 this 绑定，而是继承自外层上下文的 this。这意味着在定义箭头函数时，this 的值已经确定，并且在箭头函数的整个生命周期内不会改变。在 Vue 组件中，使用箭头函数可以确保 this 始终指向 Vue 组件实例，而不是事件触发的 DOM 元素
        // 阻止默认滚动行为
        e.preventDefault();

        // 获取手指触摸的第一个触点
        const touch = e.touches[0];

        this.moveDistance = touch.clientX;
        // console.log(this.moveDistance);
      }, { passive: false });

      // let throttleTimeout;
      //       root.addEventListener('touchmove', (e) => {
      //         if (!throttleTimeout) {
      //           throttleTimeout = setTimeout(() => {
      //             throttleTimeout = null;
      //           }, 200);
      //           // 阻止默认滚动行为
      //           e.preventDefault();
      //           // 获取手指触摸的第一个触点
      //           const touch = e.touches[0];
      //           this.moveDistance = touch.clientX;
      //           // console.log(this.moveDistance);
      //         }
      //       }, { passive: false });


      root.addEventListener("touchend", function (e) {
        console.log("手指离开")

      }, { passive: false })


    })
  },
  watch: {
    moveDistance(newVal, oldVal) {
      //vtm总共720个单位（pageX）
      let rate = 1//灵敏度
      this.move((newVal - oldVal) * rate)
      // 在此处添加您的逻辑代码
    }
  }
}


</script>




<style lang="scss">
.slide-box {
  position: fixed;
  width: 100%;
  height: 100%;
  /* background: rgba(253, 253, 253, 0.5);*/
  top: 0;
  left: 0;
  z-index: 0;

  li {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    color: transparent;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: none;
    opacity: 0.5;
    z-index: 0;
    /*
    -webkit-backface-visibility: hidden;
    -webkit-animation: imgAnimation 48s linear infinite 0s;
    -moz-animation: imgAnimation 48s linear infinite 0s;
    -o-animation: imgAnimation 48s linear infinite 0s;
    -ms-animation: imgAnimation 48s linear infinite 0s;
    animation: imgAnimation 48s linear infinite 0s;
    */

    &:nth-child(1) {
      background-image: url(./asset/image/背景.png);
      background-size: cover
    }

    &:nth-child(2) {
      background-image: url(./asset/image/背景.png);
      -webkit-animation-delay: 12s;
      -moz-animation-delay: 12s;
      -o-animation-delay: 12s;
      -ms-animation-delay: 12s;
      animation-delay: 12s;
      background-size: cover
    }

    &:nth-child(3) {
      background-image: url(./asset/image/背景.png);
      -webkit-animation-delay: 24s;
      -moz-animation-delay: 24s;
      -o-animation-delay: 24s;
      -ms-animation-delay: 24s;
      animation-delay: 24s;
      background-size: cover
    }

    &:nth-child(4) {
      background-image: url(./asset/image/背景.png);
      animation-delay: 36s;
      background-size: cover
    }
  }

}

@-webkit-keyframes imgAnimation {
  0% {
    opacity: 0.5;
    //    -webkit-animation-timing-function: ease-in;
  }

  8% {
    opacity: 1;
    -webkit-transform: scale(1.1);
    // -webkit-animation-timing-function: ease-out;
  }

  17% {
    opacity: 1;
    -webkit-transform: scale(1.2);
  }

  25% {
    opacity: 0.5;
    -webkit-transform: scale(1.3);
  }

  100% {
    opacity: 0.5;
  }
}

@keyframes imgAnimation {
  0% {
    opacity: 0.5;
    // animation-timing-function: ease-in;
  }

  8% {
    opacity: 1;
    transform: scale(1.1);
    //  animation-timing-function: ease-out;
  }

  17% {
    opacity: 1;
    transform: scale(1.2);
  }

  25% {
    opacity: 0.5;
    transform: scale(1.3);
  }

  100% {
    opacity: 0.5;
  }
}


#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}




:root {
  --post-spacing: 20px;
  --post-size: 360px;
  --mask-size: 100vw;
}

.svg {
  width: 100%;
  height: 100%;
}







#banner {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: calc(var(--post-size) / 0.72);
  /*PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDEwMDAiPjxwYXRoIGZpbGw9InJnYigyMDAsMjAwLDIwMCkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTSAwIDAgcyA2MDAgNDAwIDE0NDAgNDAwIFMgMjg4MCAwIDI &#8203;:citation[oaicite:0]{index=0}&#8203;

  -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDEwMDAiPgo8cGF0aCBmaWxsPSJyZ2IoMjAwLDIwMCwyMDApIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0gMCAwIHMgMzAwIDIwMCA3MjAgMjAwIFMgMTQ0MCAwIDE0NDAgMCB2IDEwMDAgcyAtMzAwIC0yMDAgLTcyMCAtMjAwIFMgMCAxMDAwIDAgMTAwMCBWIDAgeiIvPgo8L3N2Zz4K
);
  mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDEwMDAiPgo8cGF0aCBmaWxsPSJyZ2IoMjAwLDIwMCwyMDApIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0gMCAwIHMgMzAwIDIwMCA3MjAgMjAwIFMgMTQ0MCAwIDE0NDAgMCB2IDEwMDAgcyAtMzAwIC0yMDAgLTcyMCAtMjAwIFMgMCAxMDAwIDAgMTAwMCBWIDAgeiIvPgo8L3N2Zz4K
);
*/

  -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDEwMDAiPgo8cGF0aCBmaWxsPSJyZ2IoMjAwLDIwMCwyMDApIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0gLTYwIDAgcyA2MDAgNDAwIDE0NDAgNDAwIFMgMjgyMCAwIDI4MjAgMCB2IDEwMDAgcyAtNjAwIC00MDAgLTE0NDAgLTQwMCBTIC02MCAxMDAwIC02MCAxMDAwIFYgMCB6Ii8+Cjwvc3ZnPgo=
);
  mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDEwMDAiPgo8cGF0aCBmaWxsPSJyZ2IoMjAwLDIwMCwyMDApIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0gLTYxNiAtMTEgcyA4MzEgMjk2IDEzMTYgMjk2IFMgMTkwNiAyIDE5MDYgNSB2IDEwMDAgcyAtNzUwIC0zNTIgLTEyMDMgLTM0NiBTIC02MTkgMTA3OCAtNjE5IDEwNzggViAtMTEgeiIvPgo8L3N2Zz4K
);

  /*-webkit-mask: url(./asset/image/Cover_image-100.jpg);
mask: url(./asset/image/Cover_image-100.jpg);*/
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: var(--mask-size);
  mask-size: var(--mask-size);
  position: absolute;
  top: 120%;
  margin-left: -5px; //这里进行了修改，应该没有影响

}

#banner .img-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: absolute;
  width: 100%;
  float: left;
  height: calc(50vw / 0.72);

  -webkit-transform: translate(-180px, 0);
  transform: translate(-180px, 0);

  -webkit-animation: admission ease-out 3s;
  animation: admission ease-out 3s;

}

#banner .img-wrapper .img-box {
  height: 100%;
  display: inline-block;
  margin-right: var(--post-spacing);
  position: relative;
  cursor: pointer;
  background: rgba(202, 8, 8, 0.649);
  /* opacity: 0.3;*/
}



#banner .img-wrapper .img-box .info {
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  //justify-content: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: transparent;
  text-align: center;
  color: #cd8fc0;
  font-size: 4rem;
  font-family: sai;
  box-shadow: 0 0 20vw #2fc5fb inset;
  /*box-shadow: 10px 10px 5px -4px rgba(80, 108, 110, 0.1);*/
  opacity: 1;
  align-items: center;
  /*text-shadow: 5px 0 0 #5adfe8;*/
}



#banner .img-wrapper .img-box img {
  width: var(--post-size);
  height: 100%;
  -o-object-position: center;
  object-position: center;
  -o-object-fit: cover;
  object-fit: cover;
}



.btn-group {
  height: 15vh;
  position: absolute;
  left: 50%;
  bottom: 0%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: 1s;
  transition: 1s;
  opacity: 0;
}

.btn-group .btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #171717;
  background-color: #fc1e1e;
  margin: 10px;
  cursor: pointer;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}

.btn-group .btn:hover {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
  background-color: #000;
}

.btn-group .btn:hover .icon {
  fill: #fff;
}

.btn-group .btn .icon {
  width: 30px;
  height: 30px;
}

.btn-group .btn .right {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.img-list {
  left: 0;
}


/*
.info span {
    transform-origin: center bottom;
    transform: skewY(-10deg);
    z-index: 0;
  }
  */


div button {
  position: relative;
}

@-webkit-keyframes admission {
  0% {
    -webkit-transform: translate(140vw, 0);
    transform: translate(140vw, 0);
  }

  100% {
    -webkit-transform: translate(25vw, 0);
    transform: translate(25vw, 0);
  }
}

//出场动画
@keyframes admission {
  0% {
    -webkit-transform: translate(140vw, 0);
    transform: translate(140vw, 0);
  }

  100% {
    -webkit-transform: translate(-180px, 0);
    transform: translate(-180px, 0);
  }
}

.span_content {
  height: 20%;
  width: 30%;
  ;
  margin: 10%;
  background: url(./asset/image/Kaihu.png);
  background-size: cover;
  background-color: aqua;
}

.neon {
  position: relative;
  font-size: 5rem;
  font-family: sai;
  margin: 5%;
  text-shadow: 0 0 3vw #F4BD0A;
  animation: neon 2s ease-in-out infinite;
  z-index: 200;
}

@keyframes neon {

  0%,
  100% {
    text-shadow: 0 0 1vw #FA1C16, 0 0 3vw #FA1C16, 0 0 10vw #FA1C16, 0 0 10vw #FA1C16, 0 0 .4vw #FED128;
    color: #FFFC00;
  }

  50% {
    text-shadow: 0 0 .5vw #800E0B, 0 0 1.5vw #800E0B, 0 0 5vw #800E0B, 0 0 5vw #800E0B, 0 0 .2vw #800E0B;
    color: #806914;
  }
}

/*# sourceMappingURL=style.css.map */
</style>
