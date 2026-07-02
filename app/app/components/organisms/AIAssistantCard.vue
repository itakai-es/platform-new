<template>
  <Card type="ia">
    <CardHeader :title="godName" :icon="SparklesIcon" title-tag="h3">
      <template #actions>
        <div
          class="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-white shadow-sm flex items-center justify-center"
        >
          <img :src="godAvatar" :alt="godName" class="w-10 h-10 object-contain" />
        </div>
      </template>
    </CardHeader>

    <!-- Message + Action Buttons -->
    <CardItem layout="column" padding="md">
      <p class="text-sm text-navy-700 leading-relaxed line-clamp-3 mb-4">
        {{ displayMessage }}
      </p>
      <div class="space-y-3 w-full">
        <Button
          v-for="action in aiActions"
          :key="action.id"
          variant="secondary-yellow"
          size="sm"
          align="left"
          full-width
          :icon-left="action.icon"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </Button>
      </div>
    </CardItem>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import {
  AcademicCapIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  TrophyIcon,
  PuzzlePieceIcon,
  StarIcon,
  BookOpenIcon,
  ChartBarIcon,
  BoltIcon,
  FireIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const aiStore = useAIAssistantStore()
const authStore = useAuthStore()

interface AIAction {
  id: string
  label: string
  icon: typeof AcademicCapIcon
  chatMessage: string
}

interface Props {
  message?: string
  actions?: AIAction[]
  classId?: string
  missionId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  action: [action: AIAction]
}>()

const godName = computed(() => aiStore.currentGod?.name || 'Atenea')
const godAvatar = computed(() => aiStore.currentGod?.avatar || '/app/avatars/atenea.svg')

const displayMessage = computed(() => {
  if (props.message) return props.message
  const userName = authStore.user?.name?.split(' ')[0] || ''
  const greeting = userName ? `¡Hola ${userName}!` : '¡Hola!'
  return `${greeting} Soy ${godName.value}, tu asistente de IA. ¿En qué puedo ayudarte?`
})

const chatPath = computed(() => {
  const role = authStore.user?.role
  return role === 'teacher' ? '/profesor/asistente' : '/alumno/asistente'
})

const isTeacher = computed(() => authStore.user?.role === 'teacher')

// Pool of suggestions per role
const teacherPool = computed<AIAction[]>(() => {
  return [
    {
      id: 't1',
      label: 'Crea una misión épica',
      icon: RocketLaunchIcon,
      chatMessage: 'Quiero crear una misión épica. ¿Para qué clase y sobre qué tema debería ser?',
    },
    {
      id: 't2',
      label: 'Ideas de enigmas creativos',
      icon: PuzzlePieceIcon,
      chatMessage: 'Necesito ideas de enigmas creativos para una misión. ¿Qué me propones?',
    },
    {
      id: 't3',
      label: 'Genera una narrativa inmersiva',
      icon: BookOpenIcon,
      chatMessage: 'Quiero crear una narrativa inmersiva para una de mis clases. ¿Me ayudas?',
    },
    {
      id: 't4',
      label: 'Diseña criterios de evaluación',
      icon: ChartBarIcon,
      chatMessage:
        'Ayúdame a diseñar criterios de evaluación justos y motivadores para mis alumnos.',
    },
    {
      id: 't5',
      label: 'Sugiere una insignia temática',
      icon: TrophyIcon,
      chatMessage:
        'Necesito ideas para crear una insignia que motive a mis alumnos. ¿Qué sugieres?',
    },
    {
      id: 't6',
      label: 'Mejora mi guía del alumno',
      icon: AcademicCapIcon,
      chatMessage:
        'Quiero mejorar la guía que les doy a mis alumnos. ¿Cómo puedo hacerla más útil?',
    },
    {
      id: 't7',
      label: 'Ideas para gamificar un tema',
      icon: BoltIcon,
      chatMessage: 'Quiero gamificar un tema de mi asignatura. ¿Cómo lo harías?',
    },
    {
      id: 't8',
      label: 'Crea un reto semanal',
      icon: FireIcon,
      chatMessage: 'Quiero lanzar un reto semanal para motivar a mis alumnos. ¿Qué ideas tienes?',
    },
    {
      id: 't9',
      label: 'Estrategias para motivar',
      icon: StarIcon,
      chatMessage:
        'Algunos alumnos están desmotivados. ¿Qué estrategias de gamificación me recomiendas?',
    },
    {
      id: 't10',
      label: 'Adapta una actividad a niveles',
      icon: LightBulbIcon,
      chatMessage:
        'Tengo alumnos de distintos niveles. ¿Cómo puedo adaptar una actividad para todos?',
    },
    {
      id: 't11',
      label: 'Redacta una guía de misión',
      icon: ChatBubbleLeftRightIcon,
      chatMessage:
        'Necesito redactar una guía para presentar una misión a mis alumnos. ¿Me echas una mano?',
    },
    {
      id: 't12',
      label: 'Planifica una secuencia didáctica',
      icon: BookOpenIcon,
      chatMessage: 'Ayúdame a planificar una secuencia didáctica gamificada paso a paso.',
    },
  ]
})

const studentPool = computed<AIAction[]>(() => {
  return [
    {
      id: 's1',
      label: 'Explícame un tema difícil',
      icon: AcademicCapIcon,
      chatMessage: 'Hay un tema que me cuesta entender. ¿Puedes explicármelo de forma sencilla?',
    },
    {
      id: 's2',
      label: 'Dame pistas para un enigma',
      icon: PuzzlePieceIcon,
      chatMessage: 'Estoy atascado en un enigma. ¿Puedes darme alguna pista sin spoilers?',
    },
    {
      id: 's3',
      label: 'Consejos para subir de nivel',
      icon: StarIcon,
      chatMessage: '¿Qué puedo hacer para ganar más XP y subir de nivel más rápido?',
    },
    {
      id: 's4',
      label: 'Resumen de lo aprendido',
      icon: BookOpenIcon,
      chatMessage: 'Hazme un resumen de lo más importante que he aprendido hasta ahora.',
    },
    {
      id: 's5',
      label: 'Ayúdame con mi entrega',
      icon: ChatBubbleLeftRightIcon,
      chatMessage: 'Necesito ayuda para preparar mi próxima entrega. ¿Me orientas?',
    },
    {
      id: 's6',
      label: 'Trucos para estudiar mejor',
      icon: LightBulbIcon,
      chatMessage: '¿Qué técnicas de estudio me recomiendas para aprender más rápido?',
    },
    {
      id: 's7',
      label: '¿Qué misiones tengo pendientes?',
      icon: RocketLaunchIcon,
      chatMessage: '¿Puedes recordarme qué misiones tengo pendientes y cuáles son más urgentes?',
    },
    {
      id: 's8',
      label: 'Motívame para seguir',
      icon: FireIcon,
      chatMessage: 'Estoy un poco desanimado. ¿Puedes motivarme para seguir avanzando?',
    },
    {
      id: 's9',
      label: 'Explícame con un ejemplo',
      icon: BoltIcon,
      chatMessage: 'Necesito que me expliques algo con un ejemplo práctico y sencillo.',
    },
    {
      id: 's10',
      label: 'Prepárame para un reto',
      icon: TrophyIcon,
      chatMessage: 'Quiero prepararme bien para el próximo reto. ¿Qué debería repasar?',
    },
    {
      id: 's11',
      label: '¿Cómo mejoro mi puntuación?',
      icon: ChartBarIcon,
      chatMessage: '¿Qué puedo hacer para mejorar mi puntuación en las misiones?',
    },
    {
      id: 's12',
      label: 'Hazme un quiz rápido',
      icon: PuzzlePieceIcon,
      chatMessage: 'Hazme un quiz rápido de 5 preguntas sobre lo que estamos viendo en clase.',
    },
  ]
})

// Pick 3 random actions, refresh on mount
const pickedIndices = ref<number[]>([])

function pickRandom() {
  const pool = isTeacher.value ? teacherPool.value : studentPool.value
  const indices = Array.from({ length: pool.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  pickedIndices.value = indices.slice(0, 5)
}

onMounted(pickRandom)

const aiActions = computed(() => {
  if (props.actions?.length) return props.actions
  const pool = isTeacher.value ? teacherPool.value : studentPool.value
  return pickedIndices.value.map(i => pool[i]).filter(Boolean)
})

const handleAction = (action: AIAction) => {
  if (props.actions?.length) {
    emit('action', action)
    return
  }
  navigateTo({
    path: chatPath.value,
    query: {
      message: action.chatMessage,
      assistantId: aiStore.currentGod?.id,
      ...(props.classId && { classId: props.classId }),
      ...(props.missionId && { missionId: props.missionId }),
    },
  })
}
</script>
