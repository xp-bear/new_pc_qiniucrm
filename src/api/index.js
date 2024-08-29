// index.js
import http from "./request";

// 1.发送邮箱验证码接口 qq邮箱或者网易邮箱
export function wangyiemailApi(params) {
  return http("/wangyiemail", {
    method: "post",
    params: params,
  });
}
// 2.注册接口
export function createuserApi(params) {
  return http("/createuser", {
    method: "post",
    params: params,
  });
}
// 3.登录接口
export function userloginApi(params) {
  return http("/userlogin", {
    method: "post",
    params: params,
  });
}

// 4.多条件查询文件接口
export function pcsearchfileApi(params) {
  return http("/pcsearchfile", {
    method: "post",
    params: params,
  });
}

// 5.上传图片到七牛云
export function getQiNiuTokenApi(params) {
  return http("/token", {
    method: "get",
    params: params,
  });
}

// 6.新建文件接口
export function pcInsertfileApi(params) {
  return http("/minsertfile", {
    method: "post",
    params: params,
  });
}

// 7.删除文件接口
export function deletefileApi(params) {
  return http("/deletefile", {
    method: "post",
    params: params,
  });
}

// 8.七牛云删除文件
export function deleteQiNiuFileApi(params) {
  return http("/delete", {
    method: "post",
    params: params,
  });
}

// 9.改变文件公开隐私状态
export function isPublicChangeApi(params) {
  return http("mispublic", {
    method: "post",
    params: params,
  });
}

//10. 查询共享文件的数据
export function mSearchShareFileApi(params) {
  return http("msearchsharefile", {
    method: "post",
    params: params,
  });
}

// 11.增加浏览量的接口
export function minsertviewApi(params) {
  return http("minsertview", {
    method: "get",
    params: params,
  });
}
// 12. 根据文件id增加收藏量
export function minsertlikeApi(params) {
  return http("minsertlike", {
    method: "get",
    params: params,
  });
}
// 13.查询用户对文件的收藏情况
export function msearchlikefileApi(params) {
  return http("msearchlikefile", {
    method: "post",
    params: params,
  });
}
// 14.新增一条收藏红心数据
export function minsertlikefileApi(params) {
  return http("minsertlikefile", {
    method: "post",
    params: params,
  });
}
