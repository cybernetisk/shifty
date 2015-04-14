# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0011_auto_20150414_1845'),
    ]

    operations = [
        migrations.AddField(
            model_name='shiftendreport',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, default=1, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='shiftendreport',
            name='shift',
            field=models.OneToOneField(related_name=b'end_report', to='shifty.Shift'),
        ),
    ]
