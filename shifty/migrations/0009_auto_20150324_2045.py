# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0008_auto_20150210_2035'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shiftendreport',
            name='event',
        ),
        migrations.AlterField(
            model_name='shiftendreport',
            name='shift',
            field=models.ForeignKey(related_name=b'end_report', to='shifty.Shift', unique=True),
        ),
    ]
