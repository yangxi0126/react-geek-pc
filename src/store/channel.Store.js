import { makeAutoObservable, runInAction } from "mobx";
import { http } from "@/utils";
import { message } from "antd/es";

class ChannelStore {
  channels = [];

  constructor() {
    makeAutoObservable(this);
  }

  /*获取频道*/
  async getChannelList() {
    try {
      const { data } = await http.get("/v1_0/channels");
      runInAction(() => {
        this.channels = data.channels;
      });
    } catch (e) {
      message.error("获取频道失败:" + e);
    }
  }
}

export default ChannelStore;
