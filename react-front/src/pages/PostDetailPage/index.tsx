import {FC, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IPC_HANDLES} from "common/ipc";
import {Post} from "common/models/hexo.model";
import {PageHeader} from "antd";
import {PATH_POSTS} from "../../routes";
const electron = window.require("electron");
const { ipcRenderer } = electron;

export const PostDetailPage: FC = () =>{
  const { postId } = useParams<{postId: string}>();
  const [post, setPost] = useState<Post>();
  const history = useHistory();
  useEffect(() => {
    ipcRenderer.invoke(IPC_HANDLES.getPostById, postId).then((post: Post) => {
      setPost(post);
    });
  }, [])
  return (
    <div className='PostDetailPage'>
      <PageHeader onBack={() => history.push(PATH_POSTS)}
        title={post?.title}
      />
      { post?.raw }
    </div>
  );
}
