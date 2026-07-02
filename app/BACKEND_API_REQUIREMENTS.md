# Backend API Requirements for Activities

## Endpoint: GET /students/activities

### Overview
This endpoint returns recent activities for the authenticated student across all their enrolled classes.

### Critical Requirements

Each activity **MUST** include the following fields:

#### 1. Class-Specific Student Profile
```typescript
{
  "avatar": string,    // Student's avatar in THIS class
  "username": string,  // Student's nickname in THIS class
  "classId": string    // ID of the class where activity occurred
}
```

**Why?** Each student has a different avatar and nickname in each class (stored in `student_class_profiles` table).

#### 2. How to Populate These Fields

```typescript
// Pseudocode for creating an activity
async function createActivity(studentId, classId, activityType, data) {
  // 1. Get the class-specific profile
  const studentClassProfile = await db.studentClassProfiles.findUnique({
    where: {
      studentId_classId: {
        studentId: studentId,
        classId: classId
      }
    }
  })

  // 2. Create activity with class-specific data
  const activity = await db.activities.create({
    data: {
      type: activityType,
      timestamp: new Date(),
      studentId: studentId,
      classId: classId,

      // ✅ CRITICAL: Include class-specific profile
      avatar: studentClassProfile.avatar,      // e.g., "/app/avatars/odiseo.svg"
      username: studentClassProfile.username,  // e.g., "MateMaster99"

      // Activity-specific data
      ...data
    }
  })

  return activity
}
```

### Example Response

```json
{
  "activities": [
    {
      "id": "activity-123",
      "type": "enigma_submitted",
      "timestamp": "2026-02-02T12:00:00Z",
      "classId": "class-math-101",

      // ✅ Class-specific profile (REQUIRED)
      "avatar": "/app/avatars/odiseo.svg",
      "username": "MateMaster99",

      // Activity-specific data
      "enigmaTitle": "Ecuaciones de segundo grado",
      "enigmaXp": 40
    },
    {
      "id": "activity-124",
      "type": "enigma_completed",
      "timestamp": "2026-02-02T13:00:00Z",
      "classId": "class-history-201",

      // ✅ Different avatar/username for different class
      "avatar": "/app/avatars/atenea.svg",
      "username": "HistoriaLover",

      "enigmaTitle": "La Revolución Francesa",
      "enigmaXp": 60
    }
  ],
  "total": 2
}
```

### Activity Types and Required Fields

| Type | Required Fields |
|------|----------------|
| `enigma_submitted` | `enigmaTitle`, `avatar`, `username`, `classId` |
| `enigma_completed` | `enigmaTitle`, `enigmaXp`, `avatar`, `username`, `classId` |
| `mission_completed` | `missionTitle`, `missionXp`, `avatar`, `username`, `classId` |
| `level_up` | `newLevel`, `newTitle`, `avatar`, `username`, `classId` |
| `badge_unlocked` | `badgeName`, `badgeRarity`, `badgeImage`, `avatar`, `username`, `classId` |
| `class_joined` | `className`, `avatar`, `username`, `classId` |
| `achievement_unlocked` | `achievementName`, `avatar`, `username`, `classId` |
| `xp_gained` | `xpAmount`, `source`, `avatar`, `username`, `classId` |

### Database Schema Reference

Your backend should have a table like:

```sql
CREATE TABLE student_class_profiles (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  class_id UUID REFERENCES classes(id),
  avatar VARCHAR(255) NOT NULL,      -- e.g., "/app/avatars/odiseo.svg"
  username VARCHAR(100) NOT NULL,    -- e.g., "MateMaster99"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);
```

### Testing

To verify the implementation:

1. Create an activity for a student in a class
2. Check the response includes `avatar` and `username` from `student_class_profiles`
3. Verify different classes show different avatars/usernames for the same student

### Common Mistakes to Avoid

❌ **Don't** use the student's global profile (from `students` table)
✅ **Do** use the student's class-specific profile (from `student_class_profiles` table)

❌ **Don't** omit `avatar` and `username` fields
✅ **Do** include them in every activity

❌ **Don't** use the same avatar for all classes
✅ **Do** fetch the class-specific avatar based on `classId`
