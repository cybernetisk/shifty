from distutils.core import setup
setup(name='shifty',
      version="1",
      packages = ['shifty'],
      install_requires = ['django','south', 'djangorestframework', 'markdown', 'django-filter']
      )
