import React, {FC} from "react";
import {renderRoutes, RouteConfig} from "react-router-config";
import './style.scss';
import {Col, Row} from "antd";
import {Sidebar} from "./Sidebar";

interface Props {
  route?: RouteConfig | undefined
}

export const Dashboard: FC<Props> = ({route}) => {
  return (
    <Row className='Dashboard'>
      <Col flex='none'>
        <Sidebar/>
      </Col>
      <Col flex='auto'>
        {renderRoutes(route?.routes)}
      </Col>
    </Row>
  )
}
