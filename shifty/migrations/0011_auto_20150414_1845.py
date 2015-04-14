# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0010_auto_20150401_1941'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shiftendreport',
            name='id',
        ),
        migrations.AlterField(
            model_name='shiftendreport',
            name='shift',
            field=models.OneToOneField(related_name=b'end_report', primary_key=True, serialize=False, to='shifty.Shift'),
        ),
    ]
