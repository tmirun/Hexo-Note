import {FC} from "react";
import {Divider, Menu} from "antd";
import {FileOutlined, SettingFilled} from "@ant-design/icons";
import { useHistory } from 'react-router-dom';
import {ServerButton} from "./ServerButton";
import {PATH_CONFIG_YML, PATH_POSTS} from "../../../routes";
import './style.scss';

export const Sidebar: FC = () => {
  const navigator = useHistory()
  return (
    <div className='Sidebar'>
      <Menu
        siderCollapsed={true}
        mode='vertical'
        theme='light'>
        <Menu.Item key="posts" icon={<FileOutlined />} onClick={() => navigator.push(PATH_POSTS)}></Menu.Item>
        <Divider/>
        <Menu.Item key="config-yml" icon={<SettingFilled/>} onClick={() => navigator.push(PATH_CONFIG_YML)}/>
      </Menu>
      <Divider/>
      <ServerButton/>
    </div>
  );
}
