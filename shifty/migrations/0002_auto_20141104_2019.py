# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shifty', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShiftQualifications',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserShiftQualificationsList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='shiftqualifications',
            name='qualificationList',
            field=models.ForeignKey(to='shifty.UserShiftQualificationsList'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='shiftqualifications',
            name='shifType',
            field=models.OneToOneField(to='shifty.ShiftType'),
            preserve_default=True,
        ),
    ]
