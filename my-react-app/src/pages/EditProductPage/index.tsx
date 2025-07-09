import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Space,
  Image,
  Popconfirm,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../services/apiProduct";

const { Title } = Typography;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 14 },
};

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useGetProductQuery(Number(id));
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [form] = Form.useForm();

  const [existingImages, setExistingImages] = useState<
    { id: number; url: string; alt_text: string }[]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
      });
      setExistingImages(product.images || []);
    }
  }, [product, form]);

  const handleRemoveExistingImage = (id: number) => {
    setExistingImages((imgs) => imgs.filter((img) => img.id !== id));
  };

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("id", id!);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("description", values.description || "");
      formData.append("price", values.price?.toString() || "0");
      formData.append("category", product?.category.toString() || "");

      formData.append(
        "existing_images",
        JSON.stringify(existingImages.map((img) => img.id))
      );

      newImages.forEach((file) => {
        formData.append("uploaded_images", file);
      });

      await updateProduct(formData).unwrap();
      message.success("Товар успішно оновлено");
      navigate(-1);
    } catch (error) {
      console.error(error);
      message.error("Помилка оновлення товару");
    }
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка завантаження продукту</p>;

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
          Редагування товару
        </Title>

        <Form {...layout} form={form} onFinish={onFinish} scrollToFirstError>
          <Form.Item
            label="Назва"
            name="name"
            rules={[
              { required: true, message: "Будь ласка, введіть назву!" },
              { whitespace: true, message: "Назва не може бути порожньою!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Слаг"
            name="slug"
            rules={[
              { required: true, message: "Будь ласка, введіть слаг!" },
              {
                pattern: /^[a-z0-9\-]+$/,
                message:
                  "Слаг має містити лише латинські літери, цифри та дефіси",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Опис" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Ціна"
            name="price"
            rules={[{ required: true, message: "Будь ласка, введіть ціну!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Існуючі фото">
            <Space wrap>
              {existingImages.map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <Image
                    src={img.url}
                    alt={img.alt_text}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                    preview={{ mask: <span>Видалити</span> }}
                  />
                  <Popconfirm
                    title="Видалити це фото?"
                    onConfirm={() => handleRemoveExistingImage(img.id)}
                    okText="Так"
                    cancelText="Ні"
                  >
                    <Button
                      type="link"
                      danger
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      ✕
                    </Button>
                  </Popconfirm>
                </div>
              ))}
            </Space>
          </Form.Item>

          <ImageUploadFormItem
            name="images"
            label="Додати нові фото"
            multiple
            fileList={newImages.map((file) => ({
              uid: file.name,
              name: file.name,
              url: URL.createObjectURL(file),
            }))}
            onChange={(fileList) => {
              setNewImages(fileList.map((file) => file.originFileObj as File));
            }}
          />

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={isUpdating} block>
              Зберегти зміни
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default EditProductPage;
