import { makeAutoObservable, runInAction } from "mobx";
import { http } from "@/utils/http";
import { setToken, clearToken } from "@/utils/token";
import { message } from "antd";

class LoginStore {
  token = "";

  constructor() {
    makeAutoObservable(this);
  }

  /* 登录 */
  login = async ({ mobile, code }) => {
    try {
      const { data } = await http.post("/v1_0/authorizations", {
        mobile,
        code
      });
      runInAction(() => {
        this.token = data.token;
        setToken(data.token);
      });
    } catch (e) {
      message.error("登录失败: " + e);
    }
  };

  /* 退出 */
  logout = () => {
    this.token = "";
    clearToken();
  };
}

export default LoginStore;
