from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'account_created_on', 'updated_on')
    list_filter = ('account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    list_editable = ('phone_number',)
    ordering = ('-account_created_on',)

admin.site.register(User, UserAdmin)
