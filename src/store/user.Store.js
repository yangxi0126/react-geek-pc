import { makeAutoObservable, runInAction } from "mobx";
import { http } from "@/utils";
import { message } from "antd";

class UserStore {
  userInfo = {};

  constructor() {
    makeAutoObservable(this);
  }

  async getUserInfo() {
    try {
      const { data } = await http.get("/v1_0/user/profile");
      runInAction(() => {
        this.userInfo = data;
      });
    } catch (e) {
      message.error("获取用户信息失败: " + e);
    }
  }
}

export default UserStore;
