/**
 * Tipos para el sistema de Insignias
 * MVP GamiFP - Sistema simplificado de badges
 */

export interface Badge {
  id: string
  name: string // Nombre de la insignia
  description: string // Descripción de lo que representa
  imageUrl?: string // URL de la imagen (opcional, puede ser upload o URL externa)
  teacherId: string // Profesor que creó la insignia
  createdAt: Date
  updatedAt: Date
}

// Datos para crear una nueva insignia
export interface CreateBadgeData {
  name: string
  description: string
  imageUrl?: string
}

// Datos para actualizar una insignia
export interface UpdateBadgeData {
  name?: string
  description?: string
  imageUrl?: string
}

// Insignia obtenida por un estudiante
export interface StudentBadge {
  id: string
  badgeId: string
  studentId: string
  missionId?: string // Misión que otorgó la insignia (opcional)
  earnedAt: Date
  // Datos desnormalizados para evitar queries adicionales
  badge: Badge
}
