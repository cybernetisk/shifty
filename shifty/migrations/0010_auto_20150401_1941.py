# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0009_auto_20150324_2045'),
    ]

    operations = [
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
    ]
