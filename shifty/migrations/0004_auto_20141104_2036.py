# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shifty', '0003_auto_20141104_2027'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserShiftQualification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('shifType', models.ManyToManyField(to='shifty.ShiftType')),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='usershiftqualifications',
            name='shifType',
        ),
        migrations.RemoveField(
            model_name='usershiftqualifications',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserShiftQualifications',
        ),
    ]
