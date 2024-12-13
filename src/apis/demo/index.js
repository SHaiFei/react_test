import request from "@/utils/request.js";

// 获取内测页Demo分类配置
export const getBrainType = () => {
  return request({
    url: "/get/config",
    method: "get",
    params: {
      cfg_name: "内测页demo分类配置",
    },
  });
};

// 获取内测页Demo分类助手
export const getTypeBrain = (params) => {
  return request({
    url: "/assistant/demo",
    method: "get",
    params,
  });
};
