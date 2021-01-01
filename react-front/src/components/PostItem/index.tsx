import {Post} from "common/models/hexo.model";
import './styles.scss';
import {List} from "antd";
import React from "react";
import {useHistory} from "react-router-dom";
import {getPostDetailPathById} from "../../routes";

interface Props {
  post: Post
}

export const PostItem = ({post}: Props) => {
  const history = useHistory();
  const goToPostPage = () => {
    history.push(getPostDetailPathById(post._id))
  }
  return (
    <List.Item className='PostItem' onClick={goToPostPage}>
      <div className='PostItem__title'>{post.title}</div>
    </List.Item>
  )
}
