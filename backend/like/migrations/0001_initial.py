# Generated by Django 4.1.2 on 2022-11-05 19:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.URLField(max_length=300)),
                ('summary', models.CharField(blank=True, max_length=300)),
                ('type', models.CharField(default='Like', editable=False, max_length=4)),
                ('object', models.URLField(max_length=300, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='like', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
