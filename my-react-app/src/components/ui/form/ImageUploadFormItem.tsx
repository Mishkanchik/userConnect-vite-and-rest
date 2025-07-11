
import React from "react";
import { Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";



const { Dragger } = Upload;

type ImageUploadFormItemProps = {
  name: string;
  label?: string;
  fileList?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  multiple?: boolean;
};

const ImageUploadFormItem: React.FC<ImageUploadFormItemProps> = ({
  name,
  label = "Фото",
  fileList = [],
  onChange,
  multiple = false,
}) => {
  const props: UploadProps = {
    multiple,
    fileList,
    onChange: (info) => {
      const files = info.fileList.filter((file) => {
        const isImage = file.type?.startsWith("image/");
        if (!isImage) {
          message.error("Можна лише зображення!");
          return false;
        }
        return true;
      });
      onChange?.(files);
    },
    beforeUpload: (file) => {
      return false;
    },
    accept: "image/*",
    showUploadList: true,
  };

  return (
    <Form.Item
      label={label}
      name={name}
      getValueFromEvent={(e) => e?.fileList || []}
      valuePropName="fileList"
      normalize={(fileList) => fileList}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Натисніть або перетягніть фото сюди</p>
        <p className="ant-upload-hint">Тільки зображення</p>
      </Dragger>
    </Form.Item>
  );
};

export default ImageUploadFormItem;
