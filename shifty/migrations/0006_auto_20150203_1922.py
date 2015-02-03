# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0005_auto_20141104_2147'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usershiftqualification',
            old_name='shift_types',
            new_name='shifType',
        ),
    ]
