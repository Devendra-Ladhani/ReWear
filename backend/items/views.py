from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from items.models import Item
from items.serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('-created_at')
    serializer_class = ItemSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_swap(self, request, pk=None):
        item = self.get_object()
        if not item.is_available:
            return Response({'error': 'Item is not available for swap.'}, status=400)

        # Here, you would create a SwapRequest model instance
        return Response({'message': 'Swap request submitted successfully.'})

    # @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    @action(detail=True, methods=['post'])
    def redeem(self, request, pk=None):
        item = self.get_object()
        user = request.user

        if not item.is_available:
            return Response({'error': 'Item is already redeemed.'}, status=400)

        # For example: Assume item costs 10 points
        if user.points < 10:
            return Response({'error': 'Not enough points.'}, status=400)

        user.points -= 10
        user.save()
        item.is_available = False
        item.save()

        return Response({'message': 'Item redeemed successfully.'})
