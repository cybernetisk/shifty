from django.contrib.auth.models import Group, User
from django.db import models

class AccessRights(models.Model):
    class Meta:
        permissions = (
            ("perm1", "description of perm1"),
            ("perm2", "description of perm2"),
            ("perm3", "description of perm3"),
            ("perm4", "description of perm4")
        )

    user = models.ForeignKey(User)
    card_number = models.CharField(max_length=50)
    group = models.ForeignKey(Group)
    aktiv_level = models.BooleanField(default=False)
    operational_level = models.BooleanField(default=False)
    forening_level = models.BooleanField(default=False)
    have_access = models.CharField(max_length = 50, choices=
                                        (('0', 'should have access'),
                                         ('1', 'have access'),
                                         ('2', 'should not have access'),
                                         ('3', 'does not have access'))
                                  )


class InternCards(models.Model):
    user = models.OneToOneField(User, related_name='Card recieved')
    group = models.ForeignKey(Group)
    given_by = models.ForeignKey(User, related_name='Card given')
    date_given = models.DateField()

