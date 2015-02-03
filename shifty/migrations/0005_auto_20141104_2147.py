# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shifty', '0004_auto_20141104_2036'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usershiftqualification',
            old_name='shifType',
            new_name='shift_types',
        ),
    ]
