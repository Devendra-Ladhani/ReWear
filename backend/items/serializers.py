from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    user_uuid = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            'item_uuid', 'user_uuid', 'title', 'description', 'category',
            'item_type', 'size', 'condition', 'tags', 'image', 'item_points', 'is_available', 'created_at'
        ]
        read_only_fields = ['item_uuid', 'user_uuid', 'is_available', 'created_at']

    def get_user_uuid(self, obj):
        return str(obj.user.user_uuid)
