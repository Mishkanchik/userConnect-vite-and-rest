from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Category, Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'alt_text']

    def get_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


<<<<<<< HEAD
import json

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )
    existing_images = serializers.CharField(write_only=True, required=False)  # JSON-рядок з id фото, що залишаються

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'category', 'images', 'uploaded_images', 'existing_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        existing_images_json = validated_data.pop('existing_images', '[]')

        try:
            existing_images_ids = json.loads(existing_images_json)
        except Exception:
            existing_images_ids = []

        # Видаляємо зображення, яких немає в existing_images_ids
        for img in instance.images.all():
            if img.id not in existing_images_ids:
                img.delete()

        # Додаємо нові завантажені зображення
        # Щоб уникнути дублювання — можна перевіряти за ім'ям файлу або іншим унікальним атрибутом,
        # але найчастіше достатньо просто додавати їх, бо нові файли унікальні.
        for image in uploaded_images:
            ProductImage.objects.create(product=instance, image=image)

        # Оновлюємо інші поля продукту
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
=======
class ProductSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'category', 'name', 'slug', 'description', 'price', 'images']

    def get_images(self, obj):
        request = self.context.get('request')
        return ProductImageSerializer(obj.images.all(), many=True, context={'request': request}).data

>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91

class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'products']

    def get_products(self, obj):
        request = self.context.get('request')
        return ProductSerializer(obj.products.all(), many=True, context={'request': request}).data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'phone', 'image')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Паролі не співпадають."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувача з такою поштою не знайдено.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=6, validators=[validate_password])
