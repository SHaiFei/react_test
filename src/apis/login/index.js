import request from "../../utils/request.js";

// 登录
export const login = (data) => {
  return request({
    url: "/login",
    method: "post",
    data,
  });
};
