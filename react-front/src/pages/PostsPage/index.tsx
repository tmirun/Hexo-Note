import {Col, List, Row} from "antd";
import React, {useEffect, useState} from "react";
import {Post} from "common/models/hexo.model";
import {useDispatch} from "react-redux";
import {IPC_HANDLES} from "common/ipc";
import {getServerStateAction} from "../../store/hexoServer/actions";
import {renderRoutes, RouteConfig} from "react-router-config";
import './style.scss';
import {PostItem} from "../../components/PostItem";
const electron = window.require("electron")
const { ipcRenderer } = electron;

interface Props {
  route?: RouteConfig | undefined
}

export const PostsPage = ({route}: Props) => {
  const [posts, setPosts] = useState<Post[]>([])
  const dispatch = useDispatch();
  useEffect(() => {
    ipcRenderer.invoke(IPC_HANDLES.getPosts).then((posts: any) => {
      setPosts(posts);
      console.log(posts)
    })
    dispatch(getServerStateAction());
  }, [dispatch])

  return (
    <Row className='PostsPage'>
      <Col flex='none'>
        <List
          className='Posts__list'
          header={<div>Posts</div>}
          bordered
          dataSource={posts}
          renderItem={item => <PostItem post={item} />}
        />
      </Col>
      <Col flex='auto'>
        {renderRoutes(route?.routes)}
      </Col>
    </Row>
  )
}
