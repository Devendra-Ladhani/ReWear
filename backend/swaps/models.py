import uuid
from django.db import models
from users.models import CustomUser

class SwapRequest(models.Model):
    swap_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_swaps')
    item = models.ForeignKey('items.Item', on_delete=models.CASCADE, related_name='swap_requests')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
