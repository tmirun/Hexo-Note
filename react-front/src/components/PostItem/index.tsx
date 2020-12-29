import {Post} from "common/models/hexo.model";
import './styles.scss';
import {List} from "antd";
import React from "react";

interface Props {
  post: Post
}

export const PostItem = ({post}: Props) => {
  return (
    <List.Item className='PostItem'>
      <div className='PostItem__title'>{post.title}</div>
    </List.Item>
  )
}
