# Generated by Django 4.1.2 on 2022-10-21 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('type', models.CharField(default='author', max_length=200)),
                ('uuid', models.UUIDField(blank=True, default='160a83d6-5433-4b7b-bb0a-cb09077d9606', editable=False, primary_key=True, serialize=False)),
                ('id', models.URLField(blank=True, editable=False, null=True)),
                ('host', models.URLField(blank=True, null=True)),
                ('displayName', models.CharField(max_length=200, unique=True)),
                ('url', models.URLField(blank=True)),
                ('github', models.URLField(blank=True)),
                ('profileImage', models.URLField(blank=True, default='')),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
