<template>
  <div class="userFile">
    <!-- 用户信息展示 -->
    <div class="title">
      <div class="logo">
        <div>
          <img :src="userObj.avatar" alt="" />
        </div>
        <div class="content">
          <div style="display: flex; align-items: center">
            <span class="name">{{ userObj.username }}</span>
            <!-- <img class="sex" src="../assets/img/man.svg" alt="" /> -->
            <img class="sex" src="../assets/img/woman.svg" alt="" />
          </div>
          <span class="sign">{{ userObj.sign }}</span>
        </div>
      </div>
      <div class="money">
        <div class="coin">
          <span>硬币:</span>
          <img src="../assets/img/money.svg" alt="" />
          <span class="num">{{ userObj.user_money }}</span>
        </div>
        <a-button type="primary" danger style="width: 150px">签到</a-button>
        <!-- <a-button type="primary" disabled style="width: 150px; background-color: #f5f5f5">今日已签到</a-button> -->
      </div>
    </div>
  </div>
</template>
<script setup>
const userObj = JSON.parse(localStorage.getItem("userObj")); //本地保存的用户信息
</script>
<style scoped lang="scss">
.userFile {
  .title {
    width: 100%;
    height: 192px;
    background: url("https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/bg.webp") no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;

    .logo {
      width: 100%;
      height: 75px;
      display: flex;
      align-items: center;
      margin-top: auto;
      margin-bottom: 15px;
      margin-left: 15px;
      img {
        height: 75px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        color: #fff;
        .name {
          font-weight: 700;
          font-size: 20px;
          margin-right: 5px;
        }
        .sex {
          height: 20px;
          margin-right: 5px;
        }
        .sign {
          font-size: 14px;
        }
      }
    }
    .money {
      width: 300px;
      height: 70px;
      margin-top: auto;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .coin {
        display: flex;
        align-items: center;
        span {
          font-size: 18px;
          color: #fff;
          margin-right: 5px;
          line-height: 30px;
        }
        img {
          height: 20px;
          margin-right: 5px;
        }
        .num {
          font-weight: 700;
          font-size: 18px;
          color: #fe765f;
          text-shadow: 5px 0px 3px #f4c9a8;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
