# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0007_shiftendreport'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shiftendreport',
            name='bong_ref',
            field=models.IntegerField(null=True),
        ),
    ]
