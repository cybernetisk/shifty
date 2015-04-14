# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0015_auto_20150414_1915'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shiftendreport',
            name='shift',
            field=models.ForeignKey(related_name=b'end_report', to='shifty.Shift'),
        ),
    ]
