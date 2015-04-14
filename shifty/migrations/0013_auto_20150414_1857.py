# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0012_auto_20150414_1847'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shiftendreport',
            name='shift',
            field=models.OneToOneField(related_name=b'end_report', null=True, blank=True, to='shifty.Shift'),
        ),
    ]
