import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const activities = await prisma.activity.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  })

  console.log('=== ACTIVIDADES EN LA BD ===\n')
  activities.forEach((act, i) => {
    console.log(`${i + 1}. ${act.type} - ${act.description}`)
    console.log(`   ID: ${act.id}`)
    console.log(`   Metadata:`, JSON.stringify(act.metadata, null, 2))
    console.log(`   Created: ${act.createdAt}`)
    console.log('')
  })

  console.log(`Total: ${activities.length} actividades`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
