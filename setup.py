from distutils.core import setup
setup(name='shifty',
      version="1",
      packages = ['shifty', 'bong'],
      install_requires = ['django==1.6.3',
                          'south',
                          'djangorestframework>=2.3',
                          'markdown',
                          'django-filter',
                          'pyyaml',
                          'django-reversion',
                          'django-colorful',
                          'django-compressor']
      )
