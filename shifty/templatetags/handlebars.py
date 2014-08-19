from django import template
from django.conf import settings

import os


register = template.Library()

def handlebars_tag(filename, directory='.'):
    _id = filename[:-4]
    with open(os.path.join(directory, filename)) as f:
        content = f.read()
    return '<script class="handlebars-template" type="text/x-handlebars" data-id="{}">{}</script>'.format(_id, content)

@register.simple_tag
def handlebars():
    output = []

    for d in settings.HANDLEBARS_DIRS:
        for f in os.listdir(d):
            if f.endswith(".hbs"):
                output.append(handlebars_tag(f, directory=d))

    return "\n".join(output)
