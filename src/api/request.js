import axios from "axios";
import CONFIG from "../config/index";
// 创建新的axios实例
const service = axios.create({
  // 环境变量，需要在.env文件中配置
  baseURL: CONFIG.BASE_URL,
  // 超时时间暂定5s
  timeout: 5000,
});

// config里面配置请求前的一些处理，例如：数据转化，配置请求头，设置token,设置loading等，根据需求去添加
service.interceptors.request.use(
  (config) => {
    // 此处添加Loading
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  封装请求函数，可以根据项目实际情况处理参数（此处仅处理了get与post请求）
const Request = (url, options = {}) => {
  let method = options.method || "get";
  let params = options.params || {};

  if (method === "get" || method === "GET") {
    return new Promise((resolve, reject) => {
      service
        .get(url, {
          params: params,
        })
        .then((res) => {
          if (res && res.data) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      service
        .post(url, params)
        .then((res) => {
          if (res && res.data) {
            resolve(res.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};

export default Request;
