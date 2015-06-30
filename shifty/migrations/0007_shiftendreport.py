# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shifty', '0006_auto_20150203_1922'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShiftEndReport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('verified', models.BooleanField()),
                ('corrected_hours', models.DecimalField(null=True, max_digits=3, decimal_places=1)),
                ('bong_ref', models.IntegerField()),
                ('event', models.ForeignKey(related_name=b'end_reports', to='shifty.Event')),
                ('shift', models.ForeignKey(related_name=b'end_report', to='shifty.Shift')),
                ('signed', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
