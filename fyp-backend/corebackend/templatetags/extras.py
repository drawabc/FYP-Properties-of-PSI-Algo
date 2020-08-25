from django import template

register = template.Library()

@register.filter(name='add')
def add(value, arg):
    return value + arg

@register.filter(name='get_item')
def get_item(dictionary, key):
    return dictionary[key]