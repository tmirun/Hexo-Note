import {FC} from "react";
import {Divider, Menu} from "antd";
import {DatabaseFilled, SettingFilled} from "@ant-design/icons";
import {ServerButton} from "./ServerButton";
import { useHistory } from 'react-router-dom';
import {PATH_CONFIG_YML} from "../../routes";

export const Sidebar: FC = () => {
  const navigator = useHistory()
  return (
    <div className='Sidebar'>
      <Menu
        siderCollapsed={true}
        mode='vertical'
        theme='light'>
        <Menu.Item key="1" icon={<DatabaseFilled />}>
          Navigation One
        </Menu.Item>
        <Divider/>
        <Menu.Item key="config-yml" icon={<SettingFilled/>} onClick={() => navigator.push(PATH_CONFIG_YML)}/>
      </Menu>

      <ServerButton/>
    </div>
  );
}
