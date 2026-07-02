<template>
  <Modal
    :model-value="modelValue"
    :title="
      isEditing
        ? t('teacher.components.enigma_form_modal.edit_title')
        : t('teacher.components.enigma_form_modal.add_title')
    "
    size="lg"
    theme="light"
    persistent
    @update:model-value="handleClose"
  >
    <div class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-navy-700 mb-1.5">
          {{ t('teacher.components.enigma_form_modal.label_title') }}
          <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="form.title"
          :placeholder="t('teacher.components.enigma_form_modal.placeholder_title')"
          :error="!!errors.title"
          required
        />
        <p v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</p>
      </div>

      <!-- Rewards: XP / Coins / Maná en una sola tarjeta compacta -->
      <div>
        <label class="block text-sm font-medium text-navy-700 mb-2">
          {{ t('teacher.components.enigma_form_modal.label_rewards') }}
          <span class="text-red-500">*</span>
        </label>
        <div class="rounded-xl bg-gray-50 p-3 space-y-2.5">
          <!-- XP -->
          <div v-if="showXp" class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 w-[84px] shrink-0">
              <XpIcon class="w-4 h-4" />
              <span class="text-sm font-medium text-navy-700">
                {{ t('teacher.components.enigma_form_modal.label_xp') }}
              </span>
            </div>
            <div class="grid grid-cols-5 gap-1.5 flex-1">
              <button
                v-for="xp in xpPresets"
                :key="xp"
                type="button"
                :disabled="isPresetDisabled('xp', xp)"
                :class="chipClass(form.xp === xp, isPresetDisabled('xp', xp))"
                @click="form.xp = xp"
              >
                {{ xp }}
              </button>
            </div>
          </div>

          <!-- Monedas -->
          <div v-if="showCoins" class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 w-[84px] shrink-0">
              <CoinIcon class="w-4 h-4" />
              <span class="text-sm font-medium text-navy-700">
                {{ t('teacher.components.enigma_form_modal.label_coins') }}
              </span>
            </div>
            <div class="grid grid-cols-5 gap-1.5 flex-1">
              <button
                v-for="c in coinPresets"
                :key="c"
                type="button"
                :disabled="isPresetDisabled('coins', c)"
                :class="chipClass(form.coins === c, isPresetDisabled('coins', c))"
                @click="form.coins = c"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <!-- Maná -->
          <div v-if="showMana" class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 w-[84px] shrink-0">
              <ManaIcon class="w-4 h-4" />
              <span class="text-sm font-medium text-navy-700">
                {{ t('teacher.components.enigma_form_modal.label_mana') }}
              </span>
            </div>
            <div class="grid grid-cols-5 gap-1.5 flex-1">
              <button
                v-for="m in manaPresets"
                :key="m"
                type="button"
                :disabled="isPresetDisabled('mana', m)"
                :class="chipClass(form.mana === m, isPresetDisabled('mana', m))"
                :title="m === 0 ? t('teacher.components.enigma_form_modal.no_mana') : undefined"
                @click="form.mana = m"
              >
                {{ m === 0 ? '—' : m }}
              </button>
            </div>
          </div>
        </div>
        <p v-if="rewardsLocked" class="mt-2 text-xs text-navy-700/60">
          {{ t('teacher.components.enigma_form_modal.rewards_locked_hint') }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-navy-700 mb-1.5">
          {{ t('teacher.components.enigma_form_modal.label_description') }}
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          :class="{ 'border-red-500': errors.description }"
          :placeholder="t('teacher.components.enigma_form_modal.placeholder_description')"
          required
        />
        <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description }}</p>
      </div>

      <!-- Objectives -->
      <div>
        <label class="block text-sm font-medium text-navy-700 mb-1.5">
          {{ t('teacher.components.enigma_form_modal.label_objectives') }}
          <span class="text-navy-700/50 font-normal">{{
            t('teacher.components.enigma_form_modal.label_objectives_optional')
          }}</span>
        </label>
        <div class="space-y-2">
          <div
            v-for="(objective, index) in form.objectives"
            :key="index"
            class="flex items-center gap-2"
          >
            <span class="text-navy-700/50 text-sm">•</span>
            <input
              v-model="form.objectives[index]"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              :placeholder="t('teacher.components.enigma_form_modal.placeholder_objective')"
            />
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              :title="t('teacher.components.enigma_form_modal.btn_remove_objective')"
              @click="removeObjective(index)"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" size="sm" :icon-left="PlusIcon" @click="addObjective">
            {{ t('teacher.components.enigma_form_modal.btn_add_objective') }}
          </Button>
        </div>
      </div>

      <!-- Optional checkbox -->
      <Checkbox
        id="isOptional"
        v-model="form.isOptional"
        :label="t('teacher.components.enigma_form_modal.is_optional')"
      />
    </div>

    <template #footer>
      <Button variant="outline" @click="handleClose(false)">
        {{ t('teacher.components.enigma_form_modal.btn_cancel') }}
      </Button>
      <Button variant="primary" :disabled="isSubmitting" @click="handleSubmit">
        {{
          isSubmitting
            ? t('teacher.components.enigma_form_modal.btn_saving')
            : isEditing
              ? t('teacher.components.enigma_form_modal.btn_save')
              : t('teacher.components.enigma_form_modal.btn_add')
        }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import {
  ENIGMA_XP_PRESETS,
  ENIGMA_MANA_PRESETS,
  ENIGMA_COIN_PRESETS,
} from '~/utils/gamification-config'

const { t } = useI18n()

interface EnigmaFormData {
  id?: string
  title: string
  xp: number
  coins: number
  mana: number
  description: string
  objectives: string[]
  isOptional: boolean
}

interface Props {
  modelValue: boolean
  enigma?: EnigmaFormData | null
  // When true (a student already completed this enigma), rewards are raise-only:
  // presets below the current value are disabled.
  rewardsLocked?: boolean
  // Hide a reward row when that resource is disabled for the class.
  showXp?: boolean
  showCoins?: boolean
  showMana?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enigma: null,
  rewardsLocked: false,
  showXp: true,
  showCoins: true,
  showMana: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: EnigmaFormData]
}>()

const xpPresets = ENIGMA_XP_PRESETS
const coinPresets = ENIGMA_COIN_PRESETS
const manaPresets = ENIGMA_MANA_PRESETS

const isEditing = computed(() => !!props.enigma?.id)
const isSubmitting = ref(false)

const chipClass = (active: boolean, disabled = false) =>
  [
    'h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center border',
    disabled
      ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
      : active
        ? 'bg-navy-700 border-navy-700 text-white'
        : 'bg-white border-gray-200 text-navy-700 hover:border-navy-700/40',
  ].join(' ')

// Once a student has completed the enigma, rewards can only go up. The floor for
// each reward is its current value; presets below it are disabled.
const isPresetDisabled = (kind: 'xp' | 'coins' | 'mana', value: number) =>
  props.rewardsLocked && value < (props.enigma?.[kind] ?? 0)

// Form state
const form = reactive<EnigmaFormData>({
  title: '',
  xp: xpPresets[1], // Default to 40 XP
  coins: coinPresets[1], // Default to 40 monedas
  mana: manaPresets[1], // Default to 10 maná
  description: '',
  objectives: [],
  isOptional: false,
})

const errors = reactive({
  title: '',
  description: '',
})

// Reset form when modal opens/closes or enigma changes
watch(
  () => props.modelValue,
  isOpen => {
    if (isOpen) {
      resetForm()
    }
  }
)

watch(
  () => props.enigma,
  () => {
    if (props.modelValue) {
      resetForm()
    }
  },
  { deep: true }
)

const resetForm = () => {
  if (props.enigma) {
    form.title = props.enigma.title
    form.xp = props.enigma.xp
    form.coins = props.enigma.coins ?? coinPresets[1]
    form.mana = props.enigma.mana ?? manaPresets[1]
    form.description = props.enigma.description
    form.objectives = [...(props.enigma.objectives || [])]
    form.isOptional = props.enigma.isOptional || false
  } else {
    form.title = ''
    form.xp = xpPresets[1]
    form.coins = coinPresets[1]
    form.mana = manaPresets[1]
    form.description = ''
    form.objectives = []
    form.isOptional = false
  }
  errors.title = ''
  errors.description = ''
}

const addObjective = () => {
  form.objectives.push('')
}

const removeObjective = (index: number) => {
  form.objectives.splice(index, 1)
}

const validate = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.description = ''

  if (!form.title.trim()) {
    errors.title = t('teacher.components.enigma_form_modal.validation.title_required')
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = t('teacher.components.enigma_form_modal.validation.description_required')
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true

  try {
    // Filter out empty objectives
    const cleanedObjectives = form.objectives.filter(obj => obj.trim())

    emit('submit', {
      id: props.enigma?.id,
      title: form.title.trim(),
      xp: form.xp,
      coins: form.coins,
      mana: form.mana,
      description: form.description.trim(),
      objectives: cleanedObjectives,
      isOptional: form.isOptional,
    })

    handleClose(false)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>
