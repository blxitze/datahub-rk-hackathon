from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, ProgramViewSet, get_filter_options

router = DefaultRouter()
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'programs', ProgramViewSet, basename='program')

urlpatterns = [
    path('', include(router.urls)),
    path('filter-options/', get_filter_options, name='filter-options'),
]

