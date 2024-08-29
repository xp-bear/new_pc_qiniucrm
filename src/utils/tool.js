// kb转化成mb
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

import OSS from "ali-oss";

export function client() {
  const client = new OSS({
    region: "oss-cn-wuhan-lr", // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
    accessKeyId: "", //
    accessKeySecret: "", //
    bucket: "xp-cdn-oss", // 示例：'my-bucket-name'，填写存储空间名称。
    secure: true,
  });
  return client;
}
