import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Space,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem";
import { useCreateProductMutation } from "../../services/apiProduct";

const { Title } = Typography;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 14 },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const AddProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!slugManuallyEdited) {
      form.setFieldsValue({ slug: slugify(name) });
    }
  };

  const onSlugChange = () => {
    setSlugManuallyEdited(true);
  };

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("description", values.description || "");
      formData.append("price", values.price?.toString() || "0");
      formData.append("category", categoryId.toString());

      images.forEach((file) => {
        formData.append("uploaded_images", file);
      });

      await createProduct(formData as any).unwrap();
      message.success("Товар додано успішно!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      message.error("Помилка при додаванні товару");
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "20px auto" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          onClick={() => navigate(-1)}
          type="default"
          icon={<ArrowLeftOutlined />}
          style={{ width: 80 }}
          aria-label="Назад"
        />

        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Додавання товару
        </Title>

        <Form
          {...layout}
          form={form}
          name="add-product"
          onFinish={onFinish}
          initialValues={{
            name: "",
            slug: "",
            description: "",
            price: 0,
            images: [],
          }}
          scrollToFirstError
        >
          <Form.Item
            label="Назва"
            name="name"
            rules={[
              { required: true, message: "Будь ласка, введіть назву!" },
              { whitespace: true, message: "Назва не може бути порожньою!" },
            ]}
          >
            <Input onChange={onNameChange} />
          </Form.Item>

          <Form.Item
            label="Слаг"
            name="slug"
            rules={[
              { required: true, message: "Будь ласка, введіть слаг!" },
              { whitespace: true, message: "Слаг не може бути порожнім!" },
              {
                pattern: /^[a-z0-9\-]+$/,
                message:
                  "Слаг має містити лише латинські літери, цифри та дефіси",
              },
            ]}
          >
            <Input onChange={onSlugChange} />
          </Form.Item>

          <Form.Item label="Опис" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Ціна"
            name="price"
            rules={[
              { required: true, message: "Будь ласка, введіть ціну!" },
              {
                type: "number",
                min: 0,
                message: "Ціна не може бути від’ємною",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <ImageUploadFormItem
            name="images"
            label="Фотографії"
            multiple
            fileList={images.map((file) => ({
              uid: file.name,
              name: file.name,
              url: URL.createObjectURL(file),
            }))}
            onChange={(fileList) => {
              setImages(fileList.map((file) => file.originFileObj as File));
            }}
          />

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Додати товар
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default AddProductPage;
