from rest_framework import serializers
from .models import University, Program, UniversityImage


class ProgramSerializer(serializers.ModelSerializer):
    """Serializer for Program model."""
    
    class Meta:
        model = Program
        fields = ['id', 'title', 'code']


class RelativeImageField(serializers.ImageField):
    """Custom ImageField that returns relative URLs instead of absolute URLs."""
    
    def to_representation(self, value):
        if not value:
            return None
        # Return relative URL (e.g., /media/universities/logos/logo.png)
        return value.url


class UniversityImageSerializer(serializers.ModelSerializer):
    """Serializer for UniversityImage model."""
    image = RelativeImageField()
    
    class Meta:
        model = UniversityImage
        fields = ['id', 'image', 'caption', 'order']


class UniversityListSerializer(serializers.ModelSerializer):
    """Serializer for university list view (compact)."""
    programs_count = serializers.SerializerMethodField()
    logo = RelativeImageField()
    
    class Meta:
        model = University
        fields = [
            'id', 'name', 'city', 'logo', 'description',
            'tuition', 'rating', 'study_form', 'has_dormitory',
            'programs_count'
        ]
    
    def get_programs_count(self, obj):
        return obj.programs.count()


class UniversityDetailSerializer(serializers.ModelSerializer):
    """Serializer for university detail view (full)."""
    programs = ProgramSerializer(many=True, read_only=True)
    images = UniversityImageSerializer(many=True, read_only=True)
    study_form_display = serializers.CharField(source='get_study_form_display', read_only=True)
    logo = RelativeImageField()
    
    class Meta:
        model = University
        fields = [
            'id', 'name', 'city', 'description', 'logo',
            'iframe_3d_tour_url', 'tuition', 'rating',
            'programs', 'study_form', 'study_form_display',
            'has_dormitory', 'address', 'phone', 'email',
            'website', 'founded_year', 'students_count',
            'images', 'created_at', 'updated_at'
        ]
