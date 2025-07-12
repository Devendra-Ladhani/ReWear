import uuid
from django.db import models
from users.models import CustomUser

class Item(models.Model):
    item_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    item_type = models.CharField(max_length=100)
    size = models.CharField(max_length=10)
    condition = models.CharField(max_length=100)
    tags = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to="item_images/")
    item_points = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
