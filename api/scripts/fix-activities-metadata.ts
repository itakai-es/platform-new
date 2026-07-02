import { prisma } from '../src/config/database.js'

async function fixActivitiesMetadata() {
  console.log('🔍 Revisando actividades...\n')

  // Obtener todas las actividades
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
  })

  console.log(`📊 Total de actividades: ${activities.length}\n`)

  let fixed = 0
  let skipped = 0

  for (const activity of activities) {
    const metadata = (activity.metadata as Record<string, unknown>) || {}
    let needsUpdate = false
    const updates: Record<string, unknown> = { ...metadata }

    // Analizar según el tipo y descripción para inferir metadata faltante
    switch (activity.type) {
      case 'class_joined':
        // Si falta className, intentar extraerlo de la descripción
        if (!metadata.className && activity.description) {
          const match = activity.description.match(/clase\s+(.+?)(?:\s|$)/i)
          if (match) {
            updates.className = match[1].trim()
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo className="${updates.className}"`)
          }
        }
        break

      case 'mission_completed':
      case 'mission_started':
        // Si falta missionTitle, intentar extraerlo de la descripción
        if (!metadata.missionTitle && activity.description) {
          const match = activity.description.match(/misión\s+"([^"]+)"/i) ||
                        activity.description.match(/misión\s+(.+?)(?:\s|$)/i)
          if (match) {
            updates.missionTitle = match[1].trim()
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo missionTitle="${updates.missionTitle}"`)
          }
        }
        // Añadir XP por defecto si falta
        if (!metadata.xpEarned && activity.type === 'mission_completed') {
          updates.xpEarned = 100
          needsUpdate = true
        }
        break

      case 'enigma_completed':
      case 'enigma_submitted':
        // Si falta enigmaTitle, intentar extraerlo de la descripción
        if (!metadata.enigmaTitle && activity.description) {
          const match = activity.description.match(/"([^"]+)"/i)
          if (match) {
            updates.enigmaTitle = match[1].trim()
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo enigmaTitle="${updates.enigmaTitle}"`)
          }
        }
        // Añadir XP por defecto si falta
        if (!metadata.enigmaXp && activity.type === 'enigma_completed') {
          updates.enigmaXp = 50
          needsUpdate = true
        }
        break

      case 'level_up':
        // Si falta newLevel, intentar extraerlo de la descripción
        if (!metadata.newLevel && activity.description) {
          const match = activity.description.match(/nivel\s+(\d+)/i)
          if (match) {
            updates.newLevel = parseInt(match[1])
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo newLevel=${updates.newLevel}`)
          }
        }
        break

      case 'badge_earned':
        // Si falta badgeName, intentar extraerlo de la descripción
        if (!metadata.badgeName && activity.description) {
          const match = activity.description.match(/insignia\s+"([^"]+)"/i) ||
                        activity.description.match(/badge\s+"([^"]+)"/i)
          if (match) {
            updates.badgeName = match[1].trim()
            updates.badgeRarity = 'common'
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo badgeName="${updates.badgeName}"`)
          }
        }
        break

      case 'xp_gained':
        // Si falta xpAmount, intentar extraerlo de la descripción
        if (!metadata.xpAmount && activity.description) {
          const match = activity.description.match(/(\d+)\s*XP/i)
          if (match) {
            updates.xpAmount = parseInt(match[1])
            needsUpdate = true
            console.log(`✏️  Actualizando ${activity.id}: añadiendo xpAmount=${updates.xpAmount}`)
          }
        }
        // Si falta source, usar valor genérico
        if (!metadata.source) {
          updates.source = 'Actividad en la plataforma'
          needsUpdate = true
        }
        break
    }

    // Actualizar si es necesario
    if (needsUpdate) {
      await prisma.activity.update({
        where: { id: activity.id },
        data: { metadata: updates },
      })
      fixed++
    } else {
      skipped++
    }
  }

  console.log(`\n✅ Proceso completado:`)
  console.log(`   - Actividades actualizadas: ${fixed}`)
  console.log(`   - Actividades sin cambios: ${skipped}`)
  console.log(`   - Total: ${activities.length}`)
}

fixActivitiesMetadata()
  .then(() => {
    console.log('\n✨ ¡Listo!')
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    prisma.$disconnect()
    process.exit(1)
  })
