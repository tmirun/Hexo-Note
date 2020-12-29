import {FC} from "react";
import {Divider, Menu} from "antd";
import {DatabaseFilled} from "@ant-design/icons";
import {ServerButton} from "./ServerButton";

export const Sidebar: FC = () => {
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
      </Menu>

      <ServerButton/>
    </div>
  );
}
