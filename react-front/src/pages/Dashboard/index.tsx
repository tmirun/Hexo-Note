import React, {FC, useEffect, useState} from "react";
import {renderRoutes, RouteConfig} from "react-router-config";
import './style.scss';
import {Layout, List} from "antd";
import {IPC_HANDLES} from 'common/ipc';
import {Post} from 'common/models/hexo.model';
import {Sidebar} from "./Sidebar";
import {useDispatch} from "react-redux";
import {getServerStateAction} from "../../store/hexoServer/actions";
const electron = window.require("electron")
const { ipcRenderer } = electron;

const { Sider, Content } = Layout;

interface Props {
  route?: RouteConfig | undefined
}

export const Dashboard: FC<Props> = ({route}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const dispatch = useDispatch();
  useEffect(() => {
    ipcRenderer.invoke(IPC_HANDLES.getPosts).then((posts: any) => {
      console.log(posts)
      setPosts(posts);
    })
    dispatch(getServerStateAction());
  }, [dispatch])

  return (
    <Layout className='Dashboard'>
      <Sidebar/>
      <Sider theme='light'>
        <List
          header={<div>Posts</div>}
          bordered
          dataSource={posts}
          renderItem={item => (
            <List.Item> <span>{item.title}</span> </List.Item>
          )}
        />
      </Sider>
      <Content>
        {renderRoutes(route?.routes)}
      </Content>
    </Layout>
  )
}
