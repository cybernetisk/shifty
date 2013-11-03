from django import template
from django.conf import settings

from glob import glob
import os
register = template.Library()

INCLUDE_SOURCE_DIRS = getattr(settings, "INCLUDE_SOURCE_DIRS", None) or list()


@register.simple_tag
def includescripts(format_string=None):
	output = ""
	for source in INCLUDE_SOURCE_DIRS:
		_filter = os.path.join(source, '*.hbs')
		files = glob(_filter)

		def make_hbs_tag(path):
			_id = os.path.basename(path)[:-4]
			with open(path) as f:
			    content = f.read()
			return '<script class="handlebars-template" id="%s" type="text/handlebars">%s</script>' % (_id, content)

		files = map(make_hbs_tag, files)
		output += '<!--- things included by from %s --->\n' % source
		output += '\n'.join(files) + '\n'
		output += '<!--- end of things included by includescripts --->\n'
	return output
