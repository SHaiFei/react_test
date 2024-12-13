import { message } from "antd";

const useMessage = () => {
  const success = (content) => {
    message.success(content);
  };

  const error = (content) => {
    message.error(content);
  };

  const info = (content) => {
    message.info(content);
  };

  const warning = (content) => {
    message.warning(content);
  };

  return {
    success,
    error,
    info,
    warning,
  };
};

export default useMessage;
