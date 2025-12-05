from django.contrib import admin
from .models import University, Program, UniversityImage


class UniversityImageInline(admin.TabularInline):
    """Inline admin for university gallery images."""
    model = UniversityImage
    extra = 1
    fields = ['image', 'caption', 'order']


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    """Admin configuration for Program model."""
    list_display = ['code', 'title']
    search_fields = ['code', 'title']
    ordering = ['code']


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    """Admin configuration for University model."""
    list_display = [
        'name', 'city', 'tuition', 'rating', 
        'study_form', 'has_dormitory', 'programs_count'
    ]
    list_filter = ['city', 'study_form', 'has_dormitory', 'programs']
    search_fields = ['name', 'city', 'description']
    filter_horizontal = ['programs']
    ordering = ['-rating', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'city', 'description', 'logo')
        }),
        ('Academic Details', {
            'fields': ('programs', 'tuition', 'study_form', 'rating')
        }),
        ('Facilities', {
            'fields': ('has_dormitory', 'iframe_3d_tour_url')
        }),
        ('Contact Information', {
            'fields': ('address', 'phone', 'email', 'website')
        }),
        ('Additional Information', {
            'fields': ('founded_year', 'students_count'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [UniversityImageInline]
    
    def programs_count(self, obj):
        return obj.programs.count()
    programs_count.short_description = 'Programs'


@admin.register(UniversityImage)
class UniversityImageAdmin(admin.ModelAdmin):
    """Admin configuration for UniversityImage model."""
    list_display = ['university', 'caption', 'order']
    list_filter = ['university']
    ordering = ['university', 'order']

