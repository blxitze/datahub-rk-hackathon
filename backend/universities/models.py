from django.db import models


class Program(models.Model):
    """Academic program model."""
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    
    class Meta:
        ordering = ['title']
    
    def __str__(self):
        return f"{self.code} - {self.title}"


class University(models.Model):
    """University model with all required fields."""
    
    STUDY_FORM_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('both', 'Full-time & Part-time'),
    ]
    
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    description = models.TextField()
    logo = models.ImageField(upload_to='universities/logos/', blank=True, null=True)
    iframe_3d_tour_url = models.URLField(max_length=500, blank=True)
    tuition = models.DecimalField(max_digits=12, decimal_places=2, help_text='Annual tuition fee')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    programs = models.ManyToManyField(Program, related_name='universities', blank=True)
    study_form = models.CharField(max_length=20, choices=STUDY_FORM_CHOICES, default='full-time')
    has_dormitory = models.BooleanField(default=False)
    
    # Additional fields for detailed page
    address = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    founded_year = models.PositiveIntegerField(null=True, blank=True)
    students_count = models.PositiveIntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Universities'
        ordering = ['-rating', 'name']
    
    def __str__(self):
        return self.name


class UniversityImage(models.Model):
    """Additional images for university gallery."""
    university = models.ForeignKey(
        University, 
        related_name='images', 
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='universities/gallery/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.university.name} - Image {self.order}"

