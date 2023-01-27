import { Link } from "react-router-dom";
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, message } from "antd";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "@/static/img/error.png";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { http } from "@/utils";
import { history } from "@/utils/history";

const { Option } = Select;
const { RangePicker } = DatePicker;
const Article = () => {
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: cover => {
        return <img src={cover && cover.images[0] ? cover.images[0] : img404} width={80} height={60} alt=""/>;
      }
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220
    },
    {
      title: "状态",
      dataIndex: "status",
      render: data => {
        return (
          <Tag color={data === 2 ? "green" : "red"}>{data === 2 ? "审核通过" : "正在审核"}</Tag>
        );
      }
    },
    {
      title: "发布时间",
      dataIndex: "pubdate"
    },
    {
      title: "阅读数",
      dataIndex: "read_count"
    },
    {
      title: "评论数",
      dataIndex: "comment_count"
    },
    {
      title: "点赞数",
      dataIndex: "like_count"
    },
    {
      title: "操作",
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
              goPublish(data);
            }}/>
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined/>}
              onClick={() => {
                delArticle(data);
              }}
            />
          </Space>
        );
      }
    }
  ];

  const [articles, setArticles] = useState({
    list: [],
    total: 0
  });

  const { channelStore } = useStore();

  const [params, setParams] = useState({
    channel_id: null,
    status: null,
    begin_pubdate: null,
    end_pubdate: null,
    page: 1,
    per_page: 10
  });

  useEffect(() => {
    (async () => {
      await getArticles();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  /*获取文章列表*/
  const getArticles = async () => {
    try {
      const { data } = await http.get("/v1_0/mp/articles", { params });
      setArticles({
        list: data.results,
        total: data.total_count
      });
    } catch (e) {
      message.error("获取文章列表失败: " + e);
    }
  };

  /*表格搜索*/
  const search = values => {
    const { status, channel_id, date } = values;
    let begin_pubdate = null, end_pubdate = null;
    if (date) {
      begin_pubdate = date[0].format("YYYY-MM-DD");
      end_pubdate = date[1].format("YYYY-MM-DD");
    }
    setParams({
      ...params,
      begin_pubdate,
      end_pubdate,
      status,
      channel_id,
      page: 1
    });
  };

  /*跳转*/
  const goPublish = (row) => {
    history.push("/publish?id=" + row.id);
  };

  /*删除*/
  const delArticle = async (row) => {
    try {
      await http.delete(`/v1_0/mp/articles/${row.id}`);
      message.success("删除成功");
      setParams({
        ...params,
        page: 1
      });
    } catch (e) {
      message.error("删除失败");
    }
  };

  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: "" }} onFinish={search}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {
                channelStore.channels && channelStore.channels.map((channel) => {
                  return (
                    <Option key={channel.id}>{channel.name}</Option>
                  );
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 count 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={articles.list}/>
      </Card>
    </div>
  );
};

export default observer(Article);
