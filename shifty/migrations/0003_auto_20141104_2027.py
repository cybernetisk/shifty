# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shifty', '0002_auto_20141104_2019'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserShiftQualifications',
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
            model_name='shiftqualifications',
            name='qualificationList',
        ),
        migrations.RemoveField(
            model_name='shiftqualifications',
            name='shifType',
        ),
        migrations.DeleteModel(
            name='ShiftQualifications',
        ),
        migrations.RemoveField(
            model_name='usershiftqualificationslist',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserShiftQualificationsList',
        ),
    ]
