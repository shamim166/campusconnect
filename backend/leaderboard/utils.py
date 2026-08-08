from .models import PointLog, ImpactProfile

def award_points(user, category, action_name, points):
    """
    Awards (or deducts) points for a specific user action and logs it.
    """
    if not user.is_authenticated:
        return False
        
    # Create the log
    PointLog.objects.create(
        user=user,
        category=category,
        action_name=action_name,
        points=points
    )
    
    # Update the Impact Profile
    profile, _ = ImpactProfile.objects.get_or_create(user=user)
    
    if category == 'academic':
        profile.academic_points += points
    elif category == 'career':
        profile.career_points += points
    elif category == 'club':
        profile.club_points += points
    elif category == 'community':
        profile.community_points += points
    elif category == 'marketplace':
        profile.marketplace_points += points
        
    profile.save()
    return True
