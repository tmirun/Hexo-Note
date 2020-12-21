import {Button, message} from 'antd';
import './openProjectPage.scss';
import {IPC_CHANNEL} from 'common/ipc';
const electron = window.require("electron")
const { ipcRenderer } = electron;

export const OpenProjectPage = () => {

  const handleOpenHexoProject = async () => {
    try {
      await ipcRenderer.invoke(IPC_CHANNEL.openHexoProject);
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
