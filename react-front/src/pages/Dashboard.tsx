import React, {FC} from "react";
import {renderRoutes, RouteConfig} from "react-router-config";
import './Dashboard.scss';
import {Layout} from "antd";

const {Header, Sider, Content, Footer} = Layout;

interface Props {
  route?: RouteConfig | undefined
}

export const Dashboard: FC<Props> = ({route}) => {
  return (
    <Layout className='Dashboard'>
      <Sider>left sidebar</Sider>
      <Content>main content</Content>
    </Layout>
  )
}
