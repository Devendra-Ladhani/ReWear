from django.urls import path
from swaps.views import SentSwapListView, ReceivedSwapListView, AcceptSwapView, DeclineSwapView

urlpatterns = [
    path('sent/', SentSwapListView.as_view(), name='swaps-sent'),
    path('received/', ReceivedSwapListView.as_view(), name='swaps-received'),
    path('<uuid:pk>/accept/', AcceptSwapView.as_view(), name='swaps-accept'),
    path('<uuid:pk>/decline/', DeclineSwapView.as_view(), name='swaps-decline'),
]