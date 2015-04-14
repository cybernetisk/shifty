# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0013_auto_20150414_1857'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shiftendreport',
            name='shift',
        ),
        migrations.AddField(
            model_name='shift',
            name='end_report',
            field=models.OneToOneField(related_name=b'shift', null=True, blank=True, to='shifty.ShiftEndReport'),
            preserve_default=True,
        ),
    ]
