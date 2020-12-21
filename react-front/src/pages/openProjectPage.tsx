import {Button} from 'antd';
import './openProjectPage.scss';
import {IPC_CHANNEL} from 'common/ipc';
const electron = window.require("electron")
const { ipcRenderer } = electron;

export const OpenProjectPage = () => {

  const handleOpenHexoProject = () => {
    ipcRenderer.invoke(IPC_CHANNEL.openHexoProject);
  };

  return (
    <div className='OpenProjectPage'>
      <Button onClick={handleOpenHexoProject}> open hexo project </Button>
    </div>
  );
};
