from django.db import models
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import University, Program
from .serializers import (
    UniversityListSerializer,
    UniversityDetailSerializer,
    ProgramSerializer
)


class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing universities.
    
    list: Returns all universities (compact view)
    retrieve: Returns a single university (detailed view)
    """
    queryset = University.objects.prefetch_related('programs', 'images').all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UniversityDetailSerializer
        return UniversityListSerializer


class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing programs."""
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


@api_view(['GET'])
def get_filter_options(request):
    """
    Returns available filter options for the frontend.
    """
    cities = University.objects.values_list('city', flat=True).distinct().order_by('city')
    study_forms = [choice[0] for choice in University.STUDY_FORM_CHOICES]
    
    tuition_range = University.objects.aggregate(
        min_tuition=models.Min('tuition'),
        max_tuition=models.Max('tuition')
    )
    
    return Response({
        'cities': list(cities),
        'study_forms': study_forms,
        'tuition_range': {
            'min': tuition_range['min_tuition'] or 0,
            'max': tuition_range['max_tuition'] or 0
        }
    })

