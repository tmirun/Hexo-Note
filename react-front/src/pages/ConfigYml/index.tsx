import {Button, Form} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useEffect, useRef, useState} from "react";
import {IPC_HANDLES} from "common/ipc";
import {useDispatch} from "react-redux";
const electron = window.require("electron")
const { ipcRenderer } = electron;

interface Props {
}

export const ConfigYml = (props: Props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ipcRenderer.invoke(IPC_HANDLES.getConfigYml).then((content: string) => {
      form.setFieldsValue({content: content})
    }).finally(() => {
      setLoading(false);
    })
  }, [dispatch])

  const onFinish = async (value: {content: string}) => {
    setLoading(true);
    const content = await ipcRenderer.invoke(IPC_HANDLES.updateConfigYml, value.content);
    form.setFieldsValue({content: content})
    setLoading(false);
  }

  return (
    <div className='ConfigYml'>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Config YML" name='content'>
          <TextArea placeholder="input placeholder" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' loading={loading}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
