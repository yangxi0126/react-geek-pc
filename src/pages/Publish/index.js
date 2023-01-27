import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from "antd";
import { history } from "@/utils/history";
import { PlusOutlined } from "@ant-design/icons";
import { http } from "@/utils";
import { Link, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";

const { Option } = Select;

const Publish = () => {
  const [params] = useSearchParams();
  const articleId = params.get("id");
  const [articleForm] = Form.useForm();

  useEffect(() => {
    (async () => {
      if (articleId) {
        await getDetail();
      }
    })();
  }, []);

  /*获取详情*/
  const getDetail = async () => {
    try {
      const { data } = await http.get(`/v1_0/mp/articles/${articleId}`);
      articleForm.setFieldsValue({ ...data, type: data.cover.type });
      const formatImgList = data.cover.images.map(url => ({ url }));
      setFileList(formatImgList);
      fileCache.current = formatImgList;
      setCount(data.cover.type);
    } catch (e) {
      message.error("获取文章详情失败");
    }
  };

  /*频道列表*/
  const { channelStore } = useStore();

  /*封面改变*/
  const [count, setCount] = useState(1);
  const changeType = (value) => {
    const { target } = value;
    setCount(target.value);
    if (target.value === 3) {
      setFileList(fileCache.current);
    } else if (target.value === 1) {
      setFileList(fileList && fileList.length && fileList.length > 0 ? [fileCache.current[0]] : []);
    }
  };

  /*上传*/
  const [fileList, setFileList] = useState([]);
  const fileCache = useRef([]);
  const onUploadChange = (values) => {
    const { fileList } = values;
    setFileList(fileList);
    fileCache.current = fileList;
  };

  /*发布*/
  const publish = async (values) => {
    const { channel_id, content, title, type } = values;
    const images = [];
    fileList.map(file => {
      if (file.response) {
        images.push(file.response.data.url);
      } else {
        images.push(file.url);
      }
    });
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type,
        images
      }
    };
    try {
      if (articleId) {  //修改  后台接口有问题，他没修改到，前端传参是对的
        await http.put(`/v1_0/mp/articles/${channel_id}?draft=false`, params);
      } else {  //新增
        await http.post("/v1_0/mp/articles?draft=false", params);
      }
      message.success("发布文章成功");
      history.push("/article");
    } catch (e) {
      message.error("发布文章失败: " + e.message);
    }
  };

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>发布文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          form={articleForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: "" }}
          onFinish={publish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }}/>
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channels && channelStore.channels.map((channel) => {
                return (
                  <Option key={channel.id} value={channel.id}>
                    {channel.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {
              count > 0 && (
                <Upload
                  name="image"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList
                  action="/v1_0/upload"
                  fileList={fileList}
                  maxCount={count}
                  multiple={count > 1}
                  onChange={onUploadChange}>
                  <div style={{ marginTop: 8 }}>
                    <PlusOutlined/>
                  </div>
                </Upload>
              )
            }
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default observer(Publish);
