from rest_framework import serializers
from swaps.models import SwapRequest

class SwapRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.name', read_only=True)
    item_title = serializers.CharField(source='item.title', read_only=True)

    class Meta:
        model = SwapRequest
        fields = ['swap_uuid', 'requester', 'requester_name', 'item', 'item_title', 'message', 'status', 'created_at']
        read_only_fields = ['swap_uuid', 'requester', 'requester_name', 'item_title', 'created_at']
