from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from swaps.models import SwapRequest
from swaps.serializers import SwapRequestSerializer

class SentSwapListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SwapRequestSerializer

    def get_queryset(self):
        return SwapRequest.objects.filter(requester=self.request.user)

class ReceivedSwapListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SwapRequestSerializer

    def get_queryset(self):
        return SwapRequest.objects.filter(item__user=self.request.user)

class AcceptSwapView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SwapRequestSerializer

    def post(self, request, pk):
        swap = SwapRequest.objects.get(pk=pk)
        swap.status = 'accepted'
        swap.item.is_available = False
        swap.item.save()
        swap.save()
        return Response({"message": "Swap accepted"})

class DeclineSwapView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SwapRequestSerializer

    def post(self, request, pk):
        swap = SwapRequest.objects.get(pk=pk)
        swap.status = 'declined'
        swap.save()
        return Response({"message": "Swap declined"})