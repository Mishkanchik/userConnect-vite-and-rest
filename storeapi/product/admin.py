from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Register your models here.
from .models import Category
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone', 'image')}),
    )
    list_display = (
        'username', 'email', 'phone', 'is_staff', 'is_active',
        'date_joined', 'last_login', 'is_superuser'
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}