import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Col,
  Row,
  Tooltip,
  Radio,
  Checkbox, InputNumber,
} from "antd";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import BrainTitle from "@/view/components/BrainTitle";
import useMessage from "@/utils/useMessage";
import { QuestionCircleFilled } from "@ant-design/icons";
import eventBus from "@/eventBus";

import {
  getToolLibrary,
  getAllBrain,
  toolsList,
  getBrainFiles,
  prompt,
  createAssistant,
  getBrainDetail,
  getBrainPrompt,
} from "@/apis/brain";

import AiImage from "../../assets/image/ai.png";
import "./index.scss";

// 初始化数据
const ruleData = () => ({
  assistant_id: localStorage.getItem("assistantId") || "",
  name: "",
  description: "",
  desc_url: "",
  task_splitting_prompt: ``,
  prologue: ``,
  guidance_json_question_list: Array.from({ length: 1 }, () => ({
    id: uuidv4(),
    text: "",
  })),
  is_rerank: false,
  top_k: 4,
  space_type: "l1",
  open: 2,
  gpt_type: "gpt-4o-mini",
  temperature: 0.1,
  message_count: 5,
  search_num: 4,
  agent_list: [],
  api_list: [],
  similarity_search_value: 0.05,
  image_url: "",
  custom_base64: "",
  upload_file_types: [],
  plugin_list: [],
  power_list: [1, 2, 3],
  knowledge_file_ids: [],
  tools_ids: [],
  status: "草稿",
  review_status: "审核中",
  open_upload: false,
  is_share: true,
  is_choice_expiration_day: false,
  is_choice_valid_count_source: false,
  expiration_day: "",
  choice_expiration_day: "",
  choice_valid_count: "",
  valid_count_source: "",
  classification_id: null,
  classification_name: "",
  search_strategy: 1,
});

export default function CreateForm () {
  const { warning, success } = useMessage(); // 引入提示消息
  const [form] = Form.useForm(); // 绑定 form
  const [searchParams] = useSearchParams(); // 从路由地址获取参数
  const [platformPlugins, setPlatformPlugins] = useState([]); // 官方工具
  const [mineBrainList, setMineBrainList] = useState([]); // agent 工具
  const [apiList, setApiList] = useState([]); // api工具
  const [knowledgeBaseList, setKnowledgeBaseList] = useState([]); // 知识库数据
  const [formData, setFormData] = useState(ruleData()); // 表单数据
  const [selectPlatPlugins, setSslectPlatPlugins] = useState(ruleData());
  const [showAll, setShowAll] = useState(false); // 是否显示更多的引导示例
  const assistant_id = searchParams.get("id");

  // 获取官方工具
  const getTools = async () => {
    const { data, code } = await getToolLibrary({ internal: 5 });
    if (code === 200) {
      setPlatformPlugins(data);
    }
  };

  // 获取 agent 工具
  const queryMineCreateBrain = async () => {
    const { code, data } = await getAllBrain({
      assistant_type: 1,
      status: "上架",
    });
    if (code === 200) {
      // 给res.data.user_favorite_assistant 每一项增加一个变量区分是不是收藏的助手
      data.user_favorite_assistant.forEach((item) => {
        item.current_user_is_favorite = true;
        // 新增助手的时候给后台传值 id
        item.id = item.assistant_id;
      });

      data.user_create_assistant.forEach((item) => {
        item.current_user_is_favorite = false;
      });

      // 按照时间排序，创建助手按照创建时间排序，收藏助手按照更新时间排序
      const dataSource = [
        ...data.user_create_assistant,
        ...data.user_favorite_assistant,
      ];

      dataSource.sort((a, b) => {
        return b.current_user_is_favorite && a.current_user_is_favorite
          ? b.update_time - a.update_time
          : !b.current_user_is_favorite && !a.current_user_is_favorite
            ? b.create_time - a.create_time
            : b.current_user_is_favorite && !a.current_user_is_favorite
              ? b.update_time - a.create_time
              : b.create_time - a.update_time;
      });

      setMineBrainList(dataSource);
    }
  };

  // 获取 api 工具
  const getToolsList = async () => {
    const { data, code } = await toolsList();
    if (code === 200) {
      setApiList(data.tool);
    }
  };

  // 获取知识库数据
  const getFileList = async () => {
    const params = {
      assistant_id: null,
      page_number: 1,
      page_size: 1000,
      file_status: "学习完毕",
      user_id: null,
    };
    const { data, code } = await getBrainFiles(params);
    if (code === 200) {
      setKnowledgeBaseList(data.file);
    }
  };

  // AI 生成数据
  const generateOperate = async (type) => {
    const values = form.getFieldsValue();
    const num = values.guidance_json_question_list.length || 0;
    const name = form.getFieldValue("name");
    const description = form.getFieldValue("description");
    if (!name) return warning("请填写名称");
    if (!description) return warning("请填写简介");

    let formData = {
      type,
      num,
      name,
      description,
    };
    getPrompt(formData);
  };

  // 调用 AI 生成接口
  const getPrompt = async (formData) => {
    const { type } = formData;
    const { data, code } = await prompt(formData);
    if (code === 200) {
      switch (type) {
        case 2:
          form.setFieldsValue({
            task_splitting_prompt: data,
          });
          break;
        case 3:
          form.setFieldsValue({
            prologue: data,
          });
          break;
        case 4:
          if (Array.isArray(JSON.parse(data))) {
            form.setFieldsValue({
              guidance_json_question_list: JSON.parse(data).map((item) => item),
            });
          }
          break;
        case 5:
          form.setFieldsValue({
            description: data,
          });
          break;
      }
    }
  };

  // 点击展开更多按钮时触发，显示全部输入框
  const showMore = async () => {
    setShowAll(!showAll);
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      open: e.target.value, // 更新 open 值
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_share: e.target.checked, // 更新 is_share 值
    }));
  };

  // 保存
  const handleSave = async () => {
    try {
      const val = await form.validateFields();
      if (val) {
        const values = form.getFieldsValue();
        values.assistant_id = assistant_id;
        const mergedValues = {
          ...formData, // formData 中的值
          ...values, // 表单中的值
        };
        const { code, msg } = await createAssistant(mergedValues);
        if (code === 200) {
          success(msg);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 详情数据
  const getBrainDetails = async () => {
    const { code, data } = await getBrainDetail({
      assistant_id,
      isPublish: "2",
    });
    if (code === 200) {
      setFormData(data.assistant_detail);
    }
  };

  // 查询brain详情
  const queryBrainPrompt = async () => {
    if (assistant_id) {
      const { code, data } = await getBrainPrompt({ assistant_id });
      if (code === 200) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          gpt_type: data.gpt_type || "gpt-4o-mini",
          task_splitting_prompt: data.task_splitting_prompt || "",
          message_count: data.message_count,
          temperature: data.temperature,
        }));
      }
    }
  };

  useEffect(async () => {
    eventBus.on("handleSave", handleSave);
    await getTools();
    await getToolsList();
    await getFileList();
    await queryMineCreateBrain();

    await getBrainDetails();
    await queryBrainPrompt();

    return () => {
      eventBus.off("handleSave", handleSave);
    };
  }, []);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData); // 手动设置表单字段的值
    }
  }, [formData]);
  return (
    <Form layout="vertical" form={form} initialValues={formData}>
      <div className="create_assistant_form_content">
        <div className="create_assistant_form_content_left">
          <div className="form_source">
            <BrainTitle title="基础配置" />
            {/* 左侧表单数据 */}
            <Form.Item
              className="create_assistant_form_source"
              label="名称"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>

            <Form.Item
              className="create_assistant_form_source"
              label="简介"
              name="description"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入简介" />
            </Form.Item>

            <Form.Item
              className="create_assistant_form_source"
              label="说明文档链接地址"
              name="desc_url"
            >
              <Input placeholder="请输入说明文档链接地址" />
            </Form.Item>

            <Form.Item
              label={
                <Row justify="space-between" style={{ width: "100%" }}>
                  <div>人物设定</div>
                  <div className="AI" onClick={() => generateOperate(2)}>
                    <img src={AiImage} className="aiBulb" />
                    AI生成
                  </div>
                </Row>
              }
              name="task_splitting_prompt"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={4}
                maxLength={3000}
                placeholder="# 角色
你是一个专业的搜索专家，能够高效地在各类数据库和网络资源中进行搜索，为用户提供准确、全面的信息。
## 技能
### 技能 1：回答问题
1. 当用户提出问题时，仔细分析问题的关键信息。
2. 使用各种搜索工具和数据库进行搜索。
3. 整理搜索结果，以清晰、简洁的方式回答问题。回复示例：
答案： <回答内容>
参考来源：<列出搜索到的信息来源>

### 技能 2：查找资料
1. 用户要求查找特定资料时，明确资料的类型和范围。
2. 运用多种搜索策略，包括关键词组合、高级搜索等。
3. 提供找到的资料链接或简要介绍资料内容。回复示例：
资料链接/介绍： <资料链接或介绍内容>
参考来源：<列出搜索到的信息来源>

## 限制：
1. 只提供通过搜索得到的可靠信息，拒绝猜测或无根据的回答。
2.所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。"
              />
            </Form.Item>

            <Form.Item
              label={
                <Row justify="space-between" style={{ width: "100%" }}>
                  <div>开场白</div>
                  <div className="AI" onClick={() => generateOperate(3)}>
                    <img src={AiImage} className="aiBulb" />
                    AI生成
                  </div>
                </Row>
              }
              name="prologue"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={4}
                maxLength={200}
                placeholder="请输入开场白"
              />
            </Form.Item>

            <Form.Item
              className="create_assistant_form_source"
              label={
                <Row justify="space-between" style={{ width: "100%" }}>
                  <div>引导示例</div>
                  <div className="AI" onClick={() => generateOperate(4)}>
                    <img src={AiImage} className="aiBulb" />
                    AI生成
                  </div>
                </Row>
              }
              name="guidance_json_question_list"
              rules={[{ required: true }]}
            >
              <Form.List name="guidance_json_question_list">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <div
                        key={key}
                        style={{ display: "flex", alignItems: "center" }}
                        align="baseline"
                      >
                        <Form.Item
                          style={{ flex: 1 }}
                          {...restField}
                          name={[name, "text"]}
                          fieldKey={[fieldKey, "text"]}
                          rules={[{ required: true, message: "请输入名字!" }]}
                        >
                          <Input
                            placeholder="请输入引导示例"
                            addonAfter={
                              fields.length >= 2 ? (
                                <Button
                                  type="link"
                                  onClick={() => remove(name)}
                                >
                                  删除
                                </Button>
                              ) : null
                            }
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Form.Item>
                      <div className="guidanceJsonQuestionListButton">
                        <Button
                          onClick={() =>
                            add({
                              id: uuidv4(),
                              text: "",
                            })
                          }
                        >
                          添加提示词
                        </Button>
                        {fields.length > 3 ? (
                          <Button onClick={() => showMore()}>
                            {showAll ? "收起" : "展开更多"}
                          </Button>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </div>
        </div>
        <section
          style={{ width: "1px", backgroundColor: "#e7e7e7", margin: "0 20px" }}
        ></section>
        <div className="create_assistant_form_content_main">
          <div className="form_source">
            <BrainTitle title="模型参数" />
            <div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    className="create_assistant_form_source"
                    label="AI模型"
                    name="gpt_type"
                  >
                    <Select
                      options={[
                        { label: "GPT4o-mini", value: "gpt-4o-mini" },
                        { label: "GPT4o", value: "gpt-4o" },
                        { label: "GPT3.5", value: "gpt-3.5" },
                        { label: "KIMI", value: "kimi" },
                        { label: "GLM4(本地模型)", value: "GLM4" },
                        { label: "qwen2.5(本地模型)", value: "qwen2.5" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    className="create_assistant_form_source"
                    label={
                      <span>
                        温度
                        <Tooltip title="值越大会使输出更随机，更具创造性；值越小，输出会更加稳定。">
                          <QuestionCircleFilled
                            style={{ marginLeft: 5, color: "#bababa" }}
                          />
                        </Tooltip>
                      </span>
                    }
                    name="temperature"
                  >
                    <Input placeholder="请输入温度" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    className="create_assistant_form_source"
                    label={
                      <span>
                        历史信息
                        <Tooltip title="单次会话历史条数">
                          <QuestionCircleFilled
                            style={{ marginLeft: 5, color: "#bababa" }}
                          />
                        </Tooltip>
                      </span>
                    }
                    name="message_count"
                  >
                    <Select
                      options={[
                        { value: "0", label: "0" },
                        { value: "5", label: "5" },
                        { value: "10", label: "10" },
                        { value: "15", label: "15" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/* 工具 */}
          <div className="form_source">
            <BrainTitle title="工具" />
            <Form.Item
              className="create_assistant_form_source"
              label="官方工具"
              name="selectPlatPlugins"
            >
              <Select
                maxCount={10}
                mode="tags"
                multiple
                labelInValue
                placeholder="请选择官方工具"
                options={platformPlugins.map((plugin) => ({
                  // 自定义下拉框里边显示的内容
                  value: plugin.value.toString(),
                  label: (
                    <>
                      <div>{plugin.name}</div>
                      <div style={{ color: "#7c7c7c", fontSize: "12px" }}>
                        {plugin.description}
                      </div>
                    </>
                  ),
                }))}
                tagRender={({ label, value, closable, onClose }) => {
                  // 自定义已选标签，仅显示 plugin.name
                  const plugin = platformPlugins.find(
                    (p) => p.value.toString() === value
                  );
                  return (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "8px",
                        background: "#f0f0f0",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {plugin?.name}
                      {closable && (
                        <span
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            color: "rgba(0, 0, 0, 0.45)",
                          }}
                          onClick={onClose}
                        >
                          {/* ✖ */}×
                        </span>
                      )}
                    </span>
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              className="create_assistant_form_source"
              label="agent工具"
              name="agent_list"
            >
              <Select
                maxCount={10}
                mode="tags"
                multiple
                labelInValue
                placeholder="请选择agent工具"
                options={mineBrainList.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </Form.Item>

            <Form.Item
              className="create_assistant_form_source"
              label="自定义API工具"
              name="api_list"
            >
              <Select
                maxCount={10}
                mode="tags"
                multiple
                labelInValue
                placeholder="请选择自定义API工具"
                options={apiList.map((item) => ({
                  value: item.id,
                  label: item.tool_name,
                }))}
              />
            </Form.Item>
          </div>

          {/* 知识库 */}
          <div className="form_source">
            <BrainTitle
              title="知识库"
              annotation="选择文件后，引用知识库对话"
            />
            <Form.Item
              className="create_assistant_form_source"
              name="knowledge_file_ids"
            >
              <Select
                maxCount={10}
                mode="tags"
                multiple
                placeholder="请选择知识库"
                options={knowledgeBaseList.map((item) => ({
                  value: item.id,
                  label: item.file_name,
                }))}
              />
            </Form.Item>

            <div className="form_source_setting">
              <div className="form_source_setting_title">
                <h1>召回设置</h1>
                <span>选择知识库文件后，回答设置才有效</span>
              </div>
              <div style={{ margin: '10px 0 20px 0' }}>
                搜索策略：
                <Radio.Group
                  name="search_strategy"
                  value={formData.search_strategy}
                  onChange={handleRadioChange}
                >
                  <Radio value={1}>语义</Radio>
                </Radio.Group>
                <Tooltip title="基于文本语义相关性查询，适用于理解语义关联度和跨语言场景的使用">
                  <QuestionCircleFilled
                    style={{ marginLeft: 5, color: "#bababa" }}
                  />
                </Tooltip>
              </div>

              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      className="create_assistant_form_source"
                      label={
                        <span>
                          匹配度
                          <Tooltip title="根据设定的匹配度选取段落返给大模型，低于设定的不会被召回">
                            <QuestionCircleFilled
                              style={{ marginLeft: 5, color: "#bababa" }}
                            />
                          </Tooltip>
                        </span>
                      }
                      name="similarity_search_value"
                    >
                      <InputNumber min={1} max={10}  ></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      className="create_assistant_form_source"
                      label={
                        <span>
                          召回条数
                          <Tooltip title="基于文本语义相关性查询的条数">
                            <QuestionCircleFilled
                              style={{ marginLeft: 5, color: "#bababa" }}
                            />
                          </Tooltip>
                        </span>
                      }
                      name="top_k"
                    >
                      <InputNumber min={1} max={10}  ></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>
              </div>


            </div>
          </div>

          <div className="form_source">
            <BrainTitle title="发布范围" />
            <Radio.Group
              name="open"
              value={formData.open}
              onChange={handleRadioChange}
            >
              <Radio value={1}>仅自己可见(免审)</Radio>
              <Radio value={2}>发布到智能体中心</Radio>
              <Radio value={3}>发布到内侧(免审)</Radio>
            </Radio.Group>
            {formData.open != 3 ? (
              <div style={{ marginTop: "20px" }}>
                {
                  <Checkbox
                    name="is_share"
                    checked={formData.is_share}
                    onChange={handleCheckboxChange}
                  >
                    {formData.open == 1
                      ? "可以分享给他人"
                      : "审核通过前可以分享给他人"}
                  </Checkbox>
                }
              </div>
            ) : null}
          </div>
        </div>
        <div className="create_assistant_form_content_right"></div>
      </div>
    </Form>
  );
}
