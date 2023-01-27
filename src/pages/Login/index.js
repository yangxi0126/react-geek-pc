import { Card, Form, Input, Checkbox, Button } from "antd";
import logo from "@/static/img/logo.png";
import "./index.scss";
import { useStore } from "@/store";
import { history } from "@/utils/history";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginStore } = useStore();
  // const router = useNavigate();
  const mobileRules = [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "手机号码格式不对",
      validateTrigger: "onBlur"
    },
    { required: true, message: "请输入手机号" }
  ];
  const codeRules = [
    { len: 6, message: "验证码6个字符", validateTrigger: "onBlur" },
    { required: true, message: "请输入验证码" }
  ];
  const onFinish = async (values) => {
    const { mobile, code, remember } = values;
    if (remember) {
      await loginStore.login({ mobile, code });
      // router("/", { replace: true });
      history.push("/");
    }
  };

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt=""/>
        {/* 登录表单 */}
        <Form validateTrigger={["onBlur", "onChange"]} onFinish={(e) => {
          onFinish(e);
        }}>
          <Form.Item name="mobile" rules={mobileRules}>
            <Input size="large" placeholder="请输入手机号"/>
          </Form.Item>
          <Form.Item name="code" rules={codeRules}>
            <Input size="large" placeholder="请输入验证码" type="password"/>
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
