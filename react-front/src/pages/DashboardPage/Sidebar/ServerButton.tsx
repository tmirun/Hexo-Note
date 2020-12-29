import {DatabaseOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Button} from "antd";
import {toggleServerStateAction} from "../../../store/hexoServer/actions";

interface Props {
}

export const ServerButton = (props: Props) => {
  const serverState = useSelector<RootState, boolean>((state) => state.hexoServer.state);
  const serverInProgress = useSelector<RootState, boolean>((state) => state.hexoServer.inProgress);
  const dispatch = useDispatch();

  const startServer = () => {
    dispatch(toggleServerStateAction());
  }

  return (<Button type={serverState ? 'primary' : 'default'} shape="circle" loading={serverInProgress} onClick={startServer} icon={<DatabaseOutlined/>} />);
}
