import {Button, message} from 'antd';
import './OpenProjectPage.scss';
import {IPC_HANDLES} from 'common/ipc';
import {FC} from "react";
const electron = window.require("electron")
const { ipcRenderer } = electron;

export const OpenProjectPage: FC = () => {
  const handleOpenHexoProject = async () => {
    try {
      await ipcRenderer.invoke(IPC_HANDLES.openHexoProject);
    } catch (e) {
      message.error(e.message)
    }
  };

  return (
    <div className='OpenProjectPage'>
      <Button onClick={handleOpenHexoProject}> open hexo project </Button>
    </div>
  );
};
