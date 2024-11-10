from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import User

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        try:
            self.instance.clean()
        except ValidationError as e:
            self.add_error(None, e)

class UserAdmin(admin.ModelAdmin):
    form = UserForm

    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'account_created_on', 'updated_on')
    list_filter = ('account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-account_created_on',)

admin.site.register(User, UserAdmin)
