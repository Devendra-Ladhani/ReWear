from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from items.models import Item
from swaps.models import SwapRequest

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_items = Item.objects.filter(user=user)
        user_swaps = SwapRequest.objects.filter(requester=user)

        listed_items = user_items.count()
        pending_swaps = user_swaps.filter(status='pending').count()
        completed_swaps = user_swaps.filter(status='accepted').count()

        recent_activity = []
        for swap in user_swaps.order_by('-created_at')[:5]:
            recent_activity.append({
                'type': 'Swap completed' if swap.status == 'accepted' else 'Swap pending',
                'item': swap.item.title,
                'timestamp': swap.created_at,
            })

        return Response({
            'user': {
                'name': user.name,
                'email': user.email,
                'points': user.points,
            },
            'listed_items': listed_items,
            'pending_swaps': pending_swaps,
            'completed_swaps': completed_swaps,
            'recent_activity': recent_activity,
        })