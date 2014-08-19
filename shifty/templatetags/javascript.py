from django import template
from django.conf import settings

import os


register = template.Library()

def javascript_tag(filename, directory='.'):
    filename = filename[len(settings.BASE_DIR):].replace("assets/",'static/')
    return '<script type="text/javascript" src="{}"></script>'.format(filename)

@register.simple_tag
def javascript():
    output = []

    for d in settings.JAVASCRIPT_DIRS:
        for root, dirs, files in os.walk(d):
            for file in files:
                if not file.endswith(".js"):
                    continue
                output.append(os.path.join(root, file))
    output = map(javascript_tag, output)

    return "\n".join(output)
