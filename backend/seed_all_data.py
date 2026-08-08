import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from academic.models import Note, CTQuestion, JobPosting
from blood_donation.models import BloodDonor, BloodRequest
from clubs.models import Club, Event
from marketplace.models import MarketplaceItem, Category
from emergency.models import EmergencyContact, EmergencyCategory
from leaderboard.models import ImpactProfile, PointLog

User = get_user_model()

print("Starting to seed dummy data...")

# 1. Add 10-15 students
print("Seeding students...")
departments = ["CSE", "EEE", "BBA", "Civil", "Architecture"]
students = []
for i in range(1, 16):
    student_id = f"231100{i:03d}"
    email = f"student{i}@student.uiu.ac.bd"
    if not User.objects.filter(student_id=student_id).exists():
        user = User.objects.create_user(
            username=f"student{i}",
            password="password123",
            student_id=student_id,
            university_email=email,
            department=random.choice(departments),
            role="student",
            verified=True,
            first_name=f"Student",
            last_name=f"{i}"
        )
        students.append(user)
    else:
        students.append(User.objects.get(student_id=student_id))

# 2. Leaderboard Points
print("Seeding leaderboard...")
for student in students:
    profile, _ = ImpactProfile.objects.get_or_create(user=student)
    points_to_add = random.randint(50, 500)
    profile.academic_points += points_to_add
    profile.save()
    PointLog.objects.create(
        user=student,
        category='academic',
        action_name="Initial seed points",
        points=points_to_add
    )

# 3. Academic - Notes
print("Seeding notes...")
for i in range(15):
    Note.objects.create(
        uploaded_by=random.choice(students),
        title=f"Sample Note for {random.choice(departments)} - Vol {i}",
        subject=f"Subject {i}",
        department=random.choice(departments),
        intake=str(random.randint(30, 60)),
        description="This is a dummy note for test purposes.",
        # pdf_file="dummy.pdf" # skipping actual file
    )

# 4. Academic - CT Questions
print("Seeding CT Questions...")
for i in range(15):
    CTQuestion.objects.create(
        uploaded_by=random.choice(students),
        title=f"CT Question {random.choice(departments)} - Set {i}",
        course=f"EEE{random.randint(100, 499)}",
        department=random.choice(departments),
        intake=str(random.randint(30, 60)),
        total_questions=random.randint(3, 10),
        difficulty=random.choice(['easy', 'medium', 'hard']),
        description="Sample CT question."
    )

# 5. Academic - Jobs
print("Seeding Jobs...")
for i in range(12):
    JobPosting.objects.create(
        posted_by=random.choice(students),
        title=f"Software Engineer Intern {i}",
        company_name=f"TechCompany {i}",
        job_type=random.choice(['internship', 'full_time', 'part_time']),
        location="Dhaka, Bangladesh",
        description="Looking for an intern.",
        apply_link="https://linkedin.com",
        deadline=timezone.now() + timedelta(days=30),
        status='approved'
    )

# 6. Blood Donation
print("Seeding Blood Donation...")
blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
for i in range(12):
    BloodRequest.objects.create(
        requested_by=random.choice(students),
        patient_name=f"Patient {i}",
        blood_group=random.choice(blood_groups),
        bags_needed=random.randint(1, 3),
        hospital_name="Evercare Hospital",
        contact_person="Relative",
        contact_number="01711000000",
        required_date=timezone.now() + timedelta(days=2)
    )

# 7. Clubs
print("Seeding Clubs...")
for i in range(5):
    club, _ = Club.objects.get_or_create(
        name=f"Club {i}",
        description="Sample club",
        established_date=timezone.now().date(),
        status='approved'
    )
    for j in range(3):
        Event.objects.create(
            club=club,
            title=f"Event {j} of {club.name}",
            description="Sample event.",
            date=timezone.now() + timedelta(days=10),
            location="Room 404"
        )

# 8. Marketplace (Books & Lost/Found)
print("Seeding Marketplace...")
cat_book, _ = Category.objects.get_or_create(name="Books", slug="books")
cat_lf, _ = Category.objects.get_or_create(name="Lost & Found", slug="lost-found")
for i in range(15):
    MarketplaceItem.objects.create(
        seller=random.choice(students),
        listing_type=random.choice(["sell", "buy"]),
        category=random.choice([cat_book, cat_lf]),
        title=f"Item {i}",
        description="Dummy item",
        price=random.randint(100, 1000)
    )

# 9. Emergency
print("Seeding Emergency...")
cat_em, _ = EmergencyCategory.objects.get_or_create(name="Hospital", icon="hospital")
for i in range(10):
    EmergencyContact.objects.create(
        category=cat_em,
        name=f"Hospital {i}",
        phone=f"018110000{i:02d}",
        location="Dhaka"
    )

print("Data seeding completed successfully!")
