<<<<<<< HEAD
import React from "react";
import { Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
=======
import { useState } from "react";
import { Form, Upload, message } from "antd";
import { InboxOutlined, CloseCircleFilled } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91

const { Dragger } = Upload;

type ImageUploadFormItemProps = {
<<<<<<< HEAD
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
=======
    name: string;
    label?: string;
};

const ImageUploadFormItem: React.FC<ImageUploadFormItemProps> = ({
                                                                     name,
                                                                     label = "Фото",
                                                                 }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const props: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        beforeUpload: (file: RcFile) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("Можна лише зображення!");
                return Upload.LIST_IGNORE;
            }

            setPreviewUrl(URL.createObjectURL(file));
            return false;
        },
        showUploadList: false,
    };

    return (
        <Form.Item
            label={label}
            name={name}
            getValueFromEvent={(e) =>
                e?.file?.originFileObj || e?.fileList?.[0]?.originFileObj || null
            }
        >
            <>
                {!previewUrl ? (
                    <Dragger {...props} accept="image/*">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Натисніть або перетягніть фото сюди
                        </p>
                        <p className="ant-upload-hint">Тільки зображення (1 файл)</p>
                    </Dragger>
                ) : (
                    <div className="relative w-48 h-48 mx-auto border border-dashed border-gray-300 rounded-lg overflow-hidden shadow-md">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full text-red-500 hover:text-red-600"
                            onClick={() => setPreviewUrl(null)}
                        >
                            <CloseCircleFilled className="text-xl" />
                        </button>
                    </div>
                )}
            </>
        </Form.Item>
    );
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
};

export default ImageUploadFormItem;
