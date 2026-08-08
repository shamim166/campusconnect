from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ImpactProfile
from .serializers import ImpactProfileSerializer

class LeaderboardDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all profiles
        profiles = ImpactProfile.objects.select_related('user').all()
        
        # Sort by total points in python (since it's a property)
        # For production with large datasets, total_points should be a real field in DB.
        # But for this scope, sorting in python is fine.
        sorted_profiles = sorted(profiles, key=lambda x: x.total_points, reverse=True)
        
        top_overall = sorted_profiles[:3]
        
        # Get top for specific categories
        top_academic = sorted(profiles, key=lambda x: x.academic_points, reverse=True)
        top_academic = top_academic[0] if top_academic else None

        top_community = sorted(profiles, key=lambda x: x.community_points, reverse=True)
        top_community = top_community[0] if top_community else None

        top_career = sorted(profiles, key=lambda x: x.career_points, reverse=True)
        top_career = top_career[0] if top_career else None
        
        data = {
            "top_overall": ImpactProfileSerializer(top_overall, many=True).data,
            "top_academic": ImpactProfileSerializer(top_academic).data if top_academic else None,
            "top_community": ImpactProfileSerializer(top_community).data if top_community else None,
            "top_career": ImpactProfileSerializer(top_career).data if top_career else None,
        }
        
        return Response(data)

class LeaderboardFullView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category', 'overall')
        # timeframe = request.query_params.get('time', 'all_time') 
        # Timeframe filtering requires complex PointLog aggregation. 
        # For this version, we will just sort the profiles.
        
        profiles = ImpactProfile.objects.select_related('user').all()
        
        if category == 'academic':
            sorted_profiles = sorted(profiles, key=lambda x: x.academic_points, reverse=True)
        elif category == 'community':
            sorted_profiles = sorted(profiles, key=lambda x: x.community_points, reverse=True)
        elif category == 'career':
            sorted_profiles = sorted(profiles, key=lambda x: x.career_points, reverse=True)
        elif category == 'marketplace':
            sorted_profiles = sorted(profiles, key=lambda x: x.marketplace_points, reverse=True)
        elif category == 'club':
            sorted_profiles = sorted(profiles, key=lambda x: x.club_points, reverse=True)
        else:
            sorted_profiles = sorted(profiles, key=lambda x: x.total_points, reverse=True)
            
        return Response(ImpactProfileSerializer(sorted_profiles[:50], many=True).data)
