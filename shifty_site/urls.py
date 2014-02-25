from django.conf.urls import patterns, include, url
from rest_framework import routers
from shifty import rest

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()


router = routers.DefaultRouter()
router.register(r'event', rest.EventViewSet)
router.register(r'shift', rest.ShiftViewSet)
router.register(r'shifttype', rest.ShiftTypeViewSet)
router.register(r'user', rest.UserViewSet, "user")

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'shifty_site.views.home', name='home'),
    # url(r'^shifty_site/', include('shifty_site.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'shifty.views.backbone_router'),
    url(r'^events$', 'shifty.views.backbone_router'),
    url(r'^event/info/(\d+)$', 'shifty.views.eventInfo'), #returns JSON
    url(r'^getEvents/(\d+)/(\d+)$', 'shifty.views.getEvents'), # with limit and offset
    url(r'^rest/', include(router.urls)),
    url(r'^take_shift', 'shifty.views.take_shift'),
    url(r'^create_shift_user', 'shifty.views.create_shift_user'),
    url(r'^test', 'shifty.views.test'),
    url(r'^event/\d+', 'shifty.views.backbone_router'),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)