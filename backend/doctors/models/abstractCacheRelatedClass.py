from django.db import models
from django.core.cache import cache


class AbstractCacheRelatedClass(models.Model):
    """
    An abstarct class for objects that are probably being cached.
    The cache will be cleard upon each creation of a new record / update / delete.
    """ 
    class Meta: 
        abstract = True

    def save(self, *args, **kwargs):
        cache.clear()
        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        cache.clear()
        super().delete(*args, **kwargs)
