# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0007_shiftendreport'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shiftendreport',
            name='event',
        ),
        migrations.AddField(
            model_name='contactinfo',
            name='auto_user',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='contactinfo',
            name='claimed',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='shiftendreport',
            name='bong_ref',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
