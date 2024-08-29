<template>
  <div class="Login">
    <!-- 左右两个部分 -->
    <div class="container">
      <!-- 左侧栏目展示 广告 移动端下载 -->
      <div class="adv">
        <div class="move">
          <img src="../assets/img/ele.png" alt="" />
          <!-- 上方图片 -->
          <img class="location" :class="toggleAnimationFlag ? 'zoomInclass' : 'zoomOutClass'" src="../assets/img/ele1.png" alt="" />
          <!-- 左方图片 -->
          <img class="leftimg" :class="toggleAnimationFlag ? 'zoomInclass2' : 'zoomOutClass2'" src="../assets/img/ele2.png" />
          <!-- 右方图片 -->
          <img class="rightimg" :class="toggleAnimationFlag ? 'zoomInclass3' : 'zoomOutClass3'" src="../assets/img/ele3.png" alt="" />
        </div>
        <!-- 下方展示 移动端下载-->
        <div class="under">
          <div class="h5-app"></div>
          <div class="other-app"><img src="../assets/img/ele5.png" alt="" /></div>
        </div>
      </div>
      <!-- 表单界面在此选项-->
      <div class="form">
        <!-- .mask 弹窗提示 -->
        <div class="mask" v-show="maskFlag">{{ maskTip }}</div>

        <div class="logo-title"><img src="../assets/img/logo.png" alt="" /></div>
        <!-- 表单头部 -->
        <div class="fTitle">
          <span @click="changeForm(0)" :style="activeKey == 0 ? avtiveStyle : ''">用户注册</span>
          <span @click="changeForm(1)" :style="activeKey == 1 ? avtiveStyle : ''">账号登录</span>
        </div>
        <!-- 登录表单 -->
        <div class="logFom" v-show="activeKey == 1">
          <input type="email" placeholder="请输入用户名账号" v-model="loginData.email" />
          <input type="password" placeholder="请输入密码" v-model="loginData.password" />
          <button @click="toSend">登录</button>
          <div class="lg-info">
            <a-checkbox v-model:checked="checked" style="color: #b0b1b3; font-size: 12px">下次自动登录</a-checkbox>
            <span>忘记密码</span>
          </div>
          <div class="toReg">还没有账号? 注册一个</div>
        </div>
        <!-- 注册表单 -->
        <div class="regFom" v-show="activeKey == 0">
          <input type="email" placeholder="请输入邮箱账号" v-model="registerData.email" />
          <input type="text" placeholder="请输入验证码" v-model="registerData.verify" />
          <span class="getCode" @click="getCode" :style="hasBeenCalled ? 'color: #bbbcbe;' : 'color: #637dff;'">{{ authCodeText }}</span>
          <input type="password" placeholder="请输入密码" v-model="registerData.password" />
          <button :disabled="!regChecked" @click="toRegister">快速注册</button>
          <!-- 登录按钮遮罩层 -->
          <div class="btn-mask" v-show="!regChecked"></div>

          <a-checkbox v-model:checked="regChecked" style="color: #b0b1b3; font-size: 12px; vertical-align: top; margin-top: 10px">
            未注册手机登录时会自动创建新账号，我已阅读并同意
            <span style="color: #6d85ff">服务协议</span>
            和
            <span style="color: #6d85ff">隐私权条款</span>
          </a-checkbox>

          <div class="lg-info">
            <a-checkbox v-model:checked="checked" style="color: #b0b1b3; font-size: 12px">下次自动登录</a-checkbox>
            <span>找回密码?</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import { wangyiemailApi, createuserApi, userloginApi } from "../api/index";
import dayjs from "dayjs";

import { useRouter } from "vue-router";
const router = useRouter();

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();
let { userObj } = storeToRefs(store); //在Pinia结构的值

const toggleAnimationFlag = ref(true); //动画切换状态
const timer = ref(null); //定时器的统计状态
const activeKey = ref("1"); //默认tab状态 为登录状态
const regChecked = ref(false); //下次自动登录的状态
const checked = ref(true); //下次自动登录。
const maskTip = ref(""); //提示框的文字。
const maskFlag = ref(false); //默认不显示。

const authCodeText = ref("获取验证码"); //验证码文本
const hasBeenCalled = ref(false); // 添加一个全局变量，用于标记函数是否已经执行过

//注册表单数据
const registerData = reactive({
  email: "", //邮箱
  verify: "", //验证码
  verifySure: "", //后端传递过来的验证码
  password: "", //注册时候的密码
});
// 登录表单数据
const loginData = reactive({
  email: "", //邮箱
  password: "", //密码
});

// 计算属性用于动态内联样式
const avtiveStyle = computed(() => ({
  background: "#ffffff",
  color: "#25262b",
}));
// -----------------------------------------------------
// 获取验证码
function getCode() {
  // 先做邮箱正误核查
  if (registerData.email.length == 0) {
    return message.error("请先输入邮箱地址", 3);
  }
  if (!validateEmail(registerData.email)) {
    return message.error("邮箱格式不正确，请核查", 3);
  }

  if (hasBeenCalled.value) return; // 如果函数已经执行过，则直接返回，不再执行后续代码
  hasBeenCalled.value = true; // 标记函数已经执行过

  let count = 30; //30s的验证码重新发送
  authCodeText.value = `验证码已发送${count}s`;
  let codeTimer = setInterval(() => {
    count--;
    authCodeText.value = `验证码已发送${count}s`;
    if (count == 0) {
      clearInterval(codeTimer);
      authCodeText.value = "获取验证码";
      hasBeenCalled.value = false; // 倒计时结束后，重置标记，允许再次点击
    }
  }, 1000);

  //给邮箱发送验证码
  //对接后端接口
  wangyiemailApi({ user_email: registerData.email }).then((res) => {
    registerData.verifySure = res.VerificationCode; //验证码赋值
    message.success("验证码已发送到邮箱，请注意查收", 3);
  });
}

// 邮箱正则验证函数 返回 Boolean
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// 注册重置表单函数
function resetForm() {
  registerData.email = ""; //邮箱
  registerData.verify = ""; //验证码
  registerData.verifySure = ""; //后端传递过来的验证码
  registerData.password = ""; //注册时候的密码
}

// 点击注册按钮
function toRegister() {
  // 非空判断
  if (registerData.email.length <= 0) {
    return message.info("邮箱地址为必填项", 3);
  }

  // 邮箱和验证码的判断
  if (registerData.verifySure != registerData.verify) {
    return message.error("验证码错误", 3);
  }

  // 密码非空判断
  if (registerData.password.length <= 0) {
    return message.info("密码为必填项", 3);
  }

  // 在数据库添加一条用户数据
  let data = {
    user_name: registerData.email,
    user_password: registerData.password,
    user_email: registerData.email,
    user_sex: 0,
    user_sign: "该用户很懒，暂时没有签名。",
    user_avatar: "https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/common/default_avatar.png",
    user_createtime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  };
  // 这里就要发起注册的请求了
  createuserApi(data).then((res) => {
    resetForm(); //重置表单函数
    activeKey.value = 1; //切换到登录
    return message.success("注册成功", 3);
  });
}

// 点击登录按钮
function toSend() {
  // 表单非空校验判断
  maskFlag.value = false;
  if (loginData.email.length <= 0 || loginData.password.length <= 0) {
    maskFlag.value = true;
    maskTip.value = "必填字段不可为空";
    setTimeout(() => {
      maskFlag.value = false;
    }, 2000);
  }
  // 这里就进行登录
  let data = {
    email: loginData.email,
    password: loginData.password,
  };
  userloginApi(data).then((res) => {
    // console.log(res);
    if (res.code == 200) {
      // 本地保存登录状态
      localStorage.setItem("userObj", JSON.stringify(res.userObj));
      // 保存token信息
      localStorage.setItem("token", JSON.stringify(res.token));
      // Pinia保存登录信息
      userObj.value = res.userObj;
      // 路由跳转
      router.push("/list");
      return message.success(res.message);
    } else {
      return message.error(res.message);
    }
  });
}

// 切换表单
function changeForm(value) {
  activeKey.value = value;
}

onMounted(() => {
  // 处理动画播放
  timer.value = setInterval(() => {
    toggleAnimationFlag.value = !toggleAnimationFlag.value;
  }, 4200);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
<style scoped lang="scss">
.zoomInclass {
  animation: zoomIn 1s 0.2s ease both;
}
.zoomInclass2 {
  animation: zoomIn 1s 1.2s ease both;
}
.zoomInclass3 {
  animation: zoomIn 1s 2.2s ease both;
}
.zoomOutClass {
  animation: zoomOut 1s 0.2s ease both;
}
.zoomOutClass2 {
  animation: zoomOut 1s 1.2s ease both;
}
.zoomOutClass3 {
  animation: zoomOut 1s 2.2s ease both;
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}
@keyframes zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0; /* 元素完全透明 */
  }
}
/* --------------------------- */
.Login {
  width: 100vw;
  height: 100vh;
  background-color: #ecefff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  /* font-family: "pingfang"; */
  font-family: "consolas";
  .container {
    display: flex;
    /* width: 1213px; */
    /* height: 610px; */
    .adv {
      width: 700px;
      /* border: 1px solid #000; */
      .move {
        width: 450px;
        height: 345px;
        position: relative;
        .location {
          position: absolute;
          width: 180px;
          top: -80px;
          left: 50px;
        }
        .leftimg {
          position: absolute;
          width: 180px;
          top: 60px;
          left: -80px;
        }
        .rightimg {
          position: absolute;
          width: 180px;
          top: 0px;
          right: -70px;
        }
        img {
          width: 100%;
        }
      }
      .under {
        display: flex;
        .h5-app {
          width: 286px;
          height: 88px;
          background: url("../assets/img/ele4.png") no-repeat;
          background-size: cover;
        }
        .other-app {
          height: 88px;
          margin-left: 20px;
          img {
            height: 100%;
          }
        }
      }
    }
    .form {
      position: relative;
      width: 348px;
      /* flex: 1; */
      box-sizing: border-box;
      user-select: none;
      .mask {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 12px;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 2;
      }
      .logo-title {
        text-align: center;
        height: 48px;
        margin-bottom: 20px;
        margin-top: -50px;
        img {
          height: 100%;
        }
      }
      .fTitle {
        width: 100%;
        height: 48px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: #f5f5f6;
        display: flex;
        overflow: hidden;
        user-select: none;
        span {
          width: 50%;
          background-color: #f5f5f6;
          color: #aaabad;
          font-weight: 500;
          font-size: 18px;
          line-height: 48px;
          text-align: center;
          cursor: pointer;
        }
      }
      .regFom,
      .logFom {
        width: 100%;
        /* height: 300px; */
        background-color: #fff;
        padding: 25px;
        box-sizing: border-box;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        input {
          width: 100%;
          height: 42px;
          display: block;
          border: 0;
          outline: none;
          border-radius: 8px;
          font-size: 14px;
          background: rgba(39, 39, 41, 0.04);
          border: 1px solid transparent;
          padding-left: 12px;
          margin-bottom: 20px;
          box-sizing: border-box;
          letter-spacing: 0.012em;
          &::placeholder {
            color: #bbbcbe;
          }
        }
        button {
          width: 100%;
          height: 42px;
          background-image: linear-gradient(129.12deg, #446dff 0%, rgba(99, 125, 255, 0.75) 100%);
          border-radius: 10px;
          backdrop-filter: blur(24px);
          border-width: 0;
          box-shadow: none;
          outline: none;
          font-size: 16px;
          color: #fff;
          margin-top: 10px;
        }
        .lg-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          span {
            font-size: 12px;
            color: #637dff;
            cursor: pointer;
          }
        }
        .toReg {
          text-align: center;
          font-size: 12px;
          color: #637dff;
          text-decoration: none;
          cursor: pointer;
          margin-top: 20px;
          user-select: none;
        }
      }
      .regFom {
        position: relative;
        .getCode {
          position: absolute;
          color: #637dff;
          border: 1px solid rgba(99, 125, 255, 0.24);
          border-radius: 6px;
          padding: 2px 12px;
          line-height: 150%;
          font-size: 14px;
          margin: 8px auto;
          top: 87px;
          right: 39px;
          display: inline-block;
        }
        /* 按钮遮罩层 */
        .btn-mask {
          position: absolute;
          box-sizing: border-box;
          width: 298px;
          height: 42px;
          background-color: rgba(255, 255, 255, 0.5);
          top: 221px;
          z-index: 2;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
