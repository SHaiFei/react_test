import request from "@/utils/request.js";

// 新增助手
export const assistantList = () => {
  return request({
    url: `/assistant/bazaar/list`,
    method: "post",
    data: {
      page: 1,
      size: 30,
    },
  });
};

//获取我创建的助手
export const getCreateBrain = (params) => {
  return request({
    url: "/assistant/user/create/page",
    method: "get",
    params,
  });
};

//获取我收藏的助手
export const getFavoriteBrain = (params) => {
  return request({
    url: "/assistant/user/favorite/page",
    method: "get",
    params,
  });
};

// 知识库文件查询
export const getBrainFiles = (data) => {
  return request({
    url: "/assistant/open_file/list",
    method: "post",
    data,
  });
};

// 获取API工具列表
export const getApiTools = (data) => {
  return request({
    url: "/tools/api/detail/v2",
    method: "post",
    data,
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

// 工具库列表查询
export const getToolLibrary = (params) => {
  return request({
    url: "/assistant/plugin",
    method: "get",
    params,
  });
};

//获取所有助手
export const getAllBrain = (params) => {
  return request({
    url: "/assistant/user/list",
    method: "get",
    params,
  });
};

// api工具
export const toolsList = () => {
  return request({
    url: `/tools/api/detail/v2`,
    method: "post",
    data: {
      is_available: true,
      page_number: 1,
      page_size: 500,
    },
  });
};

// AI生成
export const prompt = (params) => {
  return request({
    url: `/ai/chat/init/prompt`,
    method: "get",
    params,
  });
};

// 助手创建
export const createAssistant = (data) => {
  return request({
    url: `/assistant/save_or_update`,
    method: "post",
    data,
  });
};

// 助手详情
export const getBrainDetail = (data) => {
  return request({
    url: "/assistant/detail",
    method: "post",
    data,
  });
};

//获取助手的prompt
export const getBrainPrompt = (data) => {
  return request({
    url: "/assistant/prompt/select",
    method: "post",
    data,
  });
};

// 助手删除
export const brainDel = (data) => {
  return request({
    url: "/assistant/delete",
    method: "post",
    data,
  });
};