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

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'shifty_site.views.home', name='home'),
    # url(r'^shifty_site/', include('shifty_site.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'shifty.views.index'),
    url(r'^shifts$', 'shifty.views.shifts'),
    url(r'^event/info/(\d+)$', 'shifty.views.eventInfo'), #returns JSON
    url(r'^rest/', include(router.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)