import { prisma } from '../src/config/database.js'

async function showActivities() {
  const activities = await prisma.activity.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\n📊 Mostrando ${activities.length} actividades más recientes:\n`)

  activities.forEach((act, i) => {
    console.log(`${i + 1}. ID: ${act.id}`)
    console.log(`   Tipo: ${act.type}`)
    console.log(`   Descripción: ${act.description}`)
    console.log(`   Metadata:`, JSON.stringify(act.metadata, null, 2))
    console.log(`   Fecha: ${act.createdAt.toISOString()}`)
    console.log('')
  })
}

showActivities()
  .then(() => {
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    prisma.$disconnect()
    process.exit(1)
  })
