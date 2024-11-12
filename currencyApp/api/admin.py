from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import User, UserCurrencyAccount

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'

class UserCurrencyAccountInline(admin.TabularInline):
    model = UserCurrencyAccount
    extra = 1

class UserAdmin(admin.ModelAdmin):
    form = UserForm

    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'account_created_on', 'updated_on')
    list_filter = ('account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-account_created_on',)
    inlines = [UserCurrencyAccountInline]


class UserCurrencyAccountAdmin(admin.ModelAdmin):
    list_display = ('account_id', 'user', 'currency_code', 'balance', 'is_active', 'updated_at')
    list_filter = ('currency_code', 'is_active', 'updated_at')
    search_fields = ('user__username', 'currency_code')



admin.site.register(User, UserAdmin)
admin.site.register(UserCurrencyAccount, UserCurrencyAccountAdmin)
