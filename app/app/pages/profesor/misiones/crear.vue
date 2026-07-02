<template>
  <div class="flex flex-col h-[calc(100vh-64px)]">
    <!-- Header -->
    <div class="bg-navy-700 -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 pt-6 pb-4">
      <nav class="flex items-center gap-1.5 sm:gap-2 text-sm">
        <NuxtLink to="/profesor/inicio" class="text-white/70 hover:text-white flex-shrink-0"
          ><HomeIcon class="w-4 h-4"
        /></NuxtLink>
        <ChevronRightIcon class="w-4 h-4 text-white/70" />
        <NuxtLink to="/profesor/misiones" class="text-white/70 hover:text-white whitespace-nowrap"
          >Misiones</NuxtLink
        >
        <ChevronRightIcon class="w-4 h-4 text-white/70" />
        <span class="text-white font-medium">Nueva</span>
      </nav>
    </div>

    <!-- WIZARD -->
    <div v-if="!showPreview" class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
      <div class="w-full max-w-4xl mx-auto">
        <!-- Progress: mobile = compact bar, desktop = circles -->
        <div class="sm:hidden flex items-center gap-3 mb-5">
          <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-navy-700 rounded-full transition-all duration-300"
              :style="{ width: `${((step + 1) / totalSteps) * 100}%` }"
            />
          </div>
          <span class="text-sm font-semibold text-navy-700 whitespace-nowrap"
            >{{ step + 1 }}/{{ totalSteps }}</span
          >
        </div>
        <div class="hidden sm:flex items-center justify-center gap-3 mb-5">
          <template v-for="i in totalSteps" :key="i">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-bold"
              :class="
                i - 1 < step
                  ? 'bg-navy-700 text-white'
                  : i - 1 === step
                    ? 'bg-navy-700 text-white'
                    : 'bg-gray-200 text-gray-400'
              "
            >
              <CheckIcon v-if="i - 1 < step" class="w-3.5 h-3.5" />
              <span v-else>{{ i }}</span>
            </div>
            <div
              v-if="i < totalSteps"
              class="w-8 h-0.5 rounded-full"
              :class="i - 1 < step ? 'bg-navy-700' : 'bg-gray-200'"
            />
          </template>
        </div>

        <!-- Card -->
        <div class="flex flex-col min-h-0 bg-white rounded-2xl shadow-lg border border-gray-100">
          <!-- God + question -->
          <div class="flex items-start gap-4 px-6 pt-6">
            <div class="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-[#FFC338]/30">
              <img :src="god.avatar" :alt="god.name" class="w-full h-full object-contain" />
            </div>
            <p class="flex-1 text-lg font-semibold text-navy-700 leading-snug pt-1">
              {{ currentQuestion }}
            </p>
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col px-6 pb-6 pt-5 min-h-0">
            <Transition name="fade" mode="out-in">
              <!-- STEP 0: Idea -->
              <div v-if="step === 0" key="s0" class="flex-1 flex flex-col">
                <!-- Class selector -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-navy-700 mb-1.5">Clase</label>
                  <SelectDropdown
                    :model-value="selectedClassId"
                    :options="classSelectOptions"
                    placeholder="Selecciona una clase"
                    @update:model-value="selectedClassId = String($event)"
                  />
                </div>
                <textarea
                  ref="inputRef"
                  v-model="idea"
                  rows="5"
                  placeholder="Ej: Quiero una misión sobre cinemática donde los alumnos calculen trayectorias de escobas voladoras..."
                  class="onb-input flex-1 resize-none"
                />
                <div class="onb-actions">
                  <span />
                  <Button
                    variant="primary"
                    size="sm"
                    :disabled="!idea.trim() || !selectedClassId || loading"
                    @click="submitIdea"
                    >Siguiente</Button
                  >
                </div>
              </div>

              <!-- STEP 1: Narrative -->
              <div v-else-if="step === 1" key="s1" class="flex-1 flex flex-col min-h-0">
                <div class="flex-1 onb-result-box overflow-y-auto min-h-0">
                  <div
                    v-if="waitingForFirstChunk && !narrative"
                    class="flex flex-col items-center justify-center gap-3 py-8"
                  >
                    <SparklesIcon class="w-5 h-5 animate-pulse text-navy-700" />
                    <span class="text-sm text-text-secondary"
                      >Creando la narrativa de tu misión...</span
                    >
                    <AILoadingBar
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                      :remaining-label="remainingTimeLabel"
                    />
                  </div>
                  <template v-else>
                    <div class="md-rendered" v-html="renderPageMarkdown(narrative)" />
                    <div v-if="!isStreaming && narrative" class="mt-2 flex justify-end">
                      <AIProviderBadge :provider="narrativeProvider" />
                    </div>
                  </template>
                </div>
                <div
                  v-if="!loading && !isStreaming && narrative && showNarrativeFeedback"
                  class="onb-feedback"
                >
                  <input
                    ref="feedbackRef"
                    v-model="feedback"
                    type="text"
                    placeholder="Ej: Quiero que sea más épica, con más referencias al tema..."
                    class="onb-feedback-input"
                    @keydown.enter.prevent="feedback.trim() && regenerateNarrative()"
                  />
                  <button
                    type="button"
                    class="onb-cancel-btn"
                    title="Cancelar"
                    @click="showNarrativeFeedback = false"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="onb-send-btn"
                    :disabled="!feedback.trim() || loading"
                    @click="regenerateNarrative"
                  >
                    <PaperAirplaneIcon class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="!loading && !isStreaming && narrative" class="onb-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="step = 0; narrative = ''"
                    >Atrás</Button
                  >
                  <div v-if="!showNarrativeFeedback" class="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="showNarrativeFeedback = true; nextTick(() => feedbackRef?.focus())"
                      >Quiero cambiar algo</Button
                    >
                    <Button variant="primary" size="sm" @click="acceptNarrative"
                      >Sí, adelante</Button
                    >
                  </div>
                </div>
              </div>

              <!-- STEP 2: Titles -->
              <div v-else-if="step === 2" key="s2" class="flex-1 flex flex-col">
                <template v-if="loading">
                  <div class="flex-1 flex flex-col items-center justify-center gap-3">
                    <SparklesIcon class="w-5 h-5 animate-pulse text-navy-700" />
                    <span class="text-sm text-text-secondary">Generando títulos...</span>
                    <AILoadingBar
                      v-if="generationProgress > 0 || isOvertime"
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                      :remaining-label="remainingTimeLabel"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="space-y-2.5">
                    <TransitionGroup name="title-item" appear>
                      <button
                        v-for="(title, i) in titles"
                        :key="title"
                        type="button"
                        class="w-full text-left px-5 py-3.5 rounded-2xl transition-all text-sm font-medium shadow-sm"
                        :class="
                          selectedTitle === title
                            ? 'bg-navy-700 text-white shadow-md'
                            : 'bg-gray-50 text-navy-700 border border-gray-200 hover:border-navy-700'
                        "
                        :style="{ animationDelay: `${i * 100}ms` }"
                        @click="selectedTitle = title; customTitle = ''"
                      >
                        {{ title }}
                      </button>
                    </TransitionGroup>
                  </div>
                  <input
                    v-model="customTitle"
                    type="text"
                    placeholder="O escribe tu propio título..."
                    class="onb-input mt-3"
                    @input="selectedTitle = ''"
                  />
                  <div v-if="showTitleFeedback" class="onb-feedback">
                    <input
                      ref="titleFeedbackRef"
                      v-model="titleFeedback"
                      type="text"
                      placeholder="Ej: Quiero títulos más épicos..."
                      class="onb-feedback-input"
                      @keydown.enter.prevent="titleFeedback.trim() && regenerateTitles()"
                    />
                    <button
                      type="button"
                      class="onb-cancel-btn"
                      title="Cancelar"
                      @click="showTitleFeedback = false"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="onb-send-btn"
                      :disabled="!titleFeedback.trim() || loading"
                      @click="regenerateTitles"
                    >
                      <PaperAirplaneIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-if="!showTitleFeedback" class="onb-actions">
                    <Button variant="outline" size="sm" @click="step = 1">Atrás</Button>
                    <div class="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="showTitleFeedback = true; nextTick(() => titleFeedbackRef?.focus())"
                        >Quiero cambiar algo</Button
                      >
                      <Button
                        variant="primary"
                        size="sm"
                        :disabled="!chosenTitle"
                        @click="acceptTitle"
                        >Sí, adelante</Button
                      >
                    </div>
                  </div>
                  <div v-else class="onb-actions">
                    <Button variant="outline" size="sm" @click="step = 1">Atrás</Button>
                  </div>
                </template>
              </div>

              <!-- STEP 3: Enigmas -->
              <div v-else-if="step === 3" key="s3" class="flex-1 flex flex-col min-h-0">
                <template v-if="enigmaError && enigmas.length === 0 && !loading && !isStreaming">
                  <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                    <p class="font-medium mb-1">No hemos podido generar los enigmas</p>
                    <p class="text-red-600/90">{{ enigmaError }}</p>
                  </div>
                  <div class="flex-1" />
                  <div class="onb-actions">
                    <Button variant="outline" size="sm" @click="step = 2">Atrás</Button>
                    <Button variant="primary" size="sm" @click="retryEnigmas">Reintentar</Button>
                  </div>
                </template>
                <template v-else-if="loading || (isStreaming && enigmas.length === 0)">
                  <div class="space-y-3">
                    <div
                      v-for="i in 4"
                      :key="i"
                      class="bg-gray-50 rounded-xl p-4 border border-gray-100 animate-pulse"
                    >
                      <div class="flex items-center justify-between mb-3">
                        <div class="h-4 bg-gray-200 rounded w-2/3" />
                        <div class="h-5 bg-gray-200 rounded-full w-14" />
                      </div>
                      <div class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded w-full" />
                        <div class="h-3 bg-gray-200 rounded w-4/5" />
                      </div>
                      <div class="space-y-1.5 mt-3">
                        <div class="h-3 bg-gray-200 rounded w-3/4" />
                        <div class="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-2 mt-4">
                    <div class="onb-loading justify-center">
                      <SparklesIcon class="w-4 h-4 animate-pulse" /><span
                        >Generando enigmas...</span
                      >
                    </div>
                    <AILoadingBar
                      v-if="waitingForFirstChunk"
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="flex-1 overflow-y-auto space-y-3 min-h-0">
                    <TransitionGroup name="title-item" appear>
                      <div
                        v-for="(enigma, i) in enigmas"
                        :key="enigma.title"
                        class="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        :style="{ animationDelay: `${i * 120}ms` }"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="font-semibold text-navy-700 text-sm">{{ enigma.title }}</h4>
                          <span
                            class="px-2 py-0.5 text-xs font-medium rounded-full"
                            style="
                              background-color: var(--color-badge-xp-bg);
                              color: var(--color-badge-xp-text);
                            "
                            >{{ enigma.xp }} XP</span
                          >
                        </div>
                        <p class="text-xs text-text-secondary leading-relaxed mb-2">
                          {{ enigma.description }}
                        </p>
                        <div v-if="enigma.objectives?.length" class="space-y-1">
                          <p
                            v-for="(obj, j) in enigma.objectives"
                            :key="j"
                            class="text-xs text-navy-700/70 flex items-start gap-1.5"
                          >
                            <span class="text-green-500 mt-0.5">✓</span>{{ obj }}
                          </p>
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>
                  <div v-if="showEnigmaFeedback" class="onb-feedback">
                    <input
                      ref="enigmaFeedbackRef"
                      v-model="enigmaFeedback"
                      type="text"
                      placeholder="Ej: Quiero más enigmas, o que sean más difíciles..."
                      class="onb-feedback-input"
                      @keydown.enter.prevent="enigmaFeedback.trim() && regenerateEnigmas()"
                    />
                    <button
                      type="button"
                      class="onb-cancel-btn"
                      title="Cancelar"
                      @click="showEnigmaFeedback = false"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      class="onb-send-btn"
                      :disabled="!enigmaFeedback.trim() || loading"
                      @click="regenerateEnigmas"
                    >
                      <PaperAirplaneIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <div
                    v-if="enigmaError && enigmas.length"
                    class="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 flex items-center justify-between gap-2"
                  >
                    <span>{{ enigmaError }}</span>
                    <button
                      type="button"
                      class="font-medium underline hover:no-underline"
                      @click="enigmaError = ''"
                    >
                      Cerrar
                    </button>
                  </div>
                  <div v-if="enigmas.length" class="mt-2 flex justify-end">
                    <AIProviderBadge :provider="enigmasProvider" />
                  </div>
                  <div v-if="!showEnigmaFeedback" class="onb-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      :disabled="isStreaming || loading"
                      @click="step = 2"
                      >Atrás</Button
                    >
                    <div class="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        :disabled="isStreaming || loading"
                        @click="showEnigmaFeedback = true; nextTick(() => enigmaFeedbackRef?.focus())"
                        >Quiero cambiar algo</Button
                      >
                      <Button
                        variant="primary"
                        size="sm"
                        :disabled="isStreaming || loading"
                        @click="step = 4"
                        >Sí, adelante</Button
                      >
                    </div>
                  </div>
                  <div v-else class="onb-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      :disabled="isStreaming || loading"
                      @click="step = 2"
                      >Atrás</Button
                    >
                  </div>
                </template>
              </div>

              <!-- STEP 4: Config -->
              <div v-else-if="step === 4" key="s4" class="flex-1 flex flex-col">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-navy-700 mb-1.5">Dificultad</label>
                    <div class="flex gap-2">
                      <button
                        v-for="r in rarities"
                        :key="r.value"
                        type="button"
                        class="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        :class="
                          rarity === r.value
                            ? 'bg-navy-700 text-white'
                            : 'bg-gray-50 text-navy-700 border border-gray-200 hover:border-navy-700'
                        "
                        @click="rarity = r.value"
                      >
                        {{ r.label }}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-navy-700 mb-1.5"
                      >Fecha límite (opcional)</label
                    >
                    <input v-model="deadline" type="date" class="onb-input" />
                  </div>
                </div>
                <div class="flex-1" />
                <div class="onb-actions">
                  <Button variant="outline" size="sm" @click="step = 3">Atrás</Button>
                  <Button variant="primary" size="sm" @click="step = 5">Siguiente</Button>
                </div>
              </div>

              <!-- STEP 5: Cover -->
              <div v-else-if="step === 5" key="s5" class="flex-1 flex flex-col min-h-0">
                <div class="flex-1 flex items-center justify-center min-h-0">
                  <!-- Loading skeleton -->
                  <div
                    v-if="isGeneratingImage && !generatedImageUrl"
                    class="w-full max-w-md flex flex-col items-center gap-3"
                  >
                    <div
                      class="w-full aspect-video rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center"
                    >
                      <PhotoIcon class="w-12 h-12 text-gray-300" />
                    </div>
                    <SparklesIcon class="w-5 h-5 animate-pulse text-navy-700" />
                    <span class="text-sm text-text-secondary">Generando portada...</span>
                    <AILoadingBar
                      v-if="generationProgress > 0 || isOvertime"
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                      :remaining-label="remainingTimeLabel"
                    />
                  </div>
                  <!-- Generated image -->
                  <div v-else-if="generatedImageUrl" class="w-full max-w-md">
                    <div class="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <img :src="generatedImageUrl" alt="" class="w-full h-full object-cover" />
                    </div>
                    <div class="mt-2 flex justify-end">
                      <AIProviderBadge :provider="coverProvider" />
                    </div>
                  </div>
                  <!-- Error with retry -->
                  <div
                    v-else-if="imageGenerationFailed"
                    class="flex flex-col items-center gap-4 text-text-secondary"
                  >
                    <PhotoIcon class="w-12 h-12 opacity-40" />
                    <p class="text-sm">
                      No se pudo generar la portada. Puedes reintentar o saltar este paso.
                    </p>
                    <Button variant="primary" size="sm" @click="generateMissionCover()">
                      <ArrowPathIcon class="w-4 h-4 mr-2" />
                      Reintentar
                    </Button>
                  </div>
                </div>
                <div v-if="!isGeneratingImage && showImageFeedback" class="onb-feedback">
                  <input
                    ref="imageFeedbackRef"
                    v-model="imageFeedback"
                    type="text"
                    placeholder="Ej: Quiero que sea más oscura, con un fondo de batalla..."
                    class="onb-feedback-input"
                    @keydown.enter.prevent="imageFeedback.trim() && regenerateMissionCover()"
                  />
                  <button
                    type="button"
                    class="onb-cancel-btn"
                    title="Cancelar"
                    @click="showImageFeedback = false"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="onb-send-btn"
                    :disabled="!imageFeedback.trim() || isGeneratingImage"
                    @click="regenerateMissionCover"
                  >
                    <PaperAirplaneIcon class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="!isGeneratingImage && !showImageFeedback" class="onb-actions">
                  <Button variant="outline" size="sm" @click="step = 4">Atrás</Button>
                  <div class="flex gap-2">
                    <Button
                      v-if="generatedImageUrl"
                      variant="outline"
                      size="sm"
                      @click="showImageFeedback = true; nextTick(() => imageFeedbackRef?.focus())"
                      >Quiero cambiar algo</Button
                    >
                    <Button variant="outline" size="sm" @click="step = 6">Saltar</Button>
                    <Button v-if="generatedImageUrl" variant="primary" size="sm" @click="step = 6"
                      >Sí, adelante</Button
                    >
                  </div>
                </div>
                <div v-else-if="!isGeneratingImage && showImageFeedback" class="onb-actions">
                  <Button variant="outline" size="sm" @click="step = 4">Atrás</Button>
                </div>
              </div>

              <!-- STEP 6: Mission Guide / Briefing -->
              <div v-else-if="step === 6" key="s6" class="flex-1 flex flex-col min-h-0">
                <div class="flex-1 onb-result-box overflow-y-auto min-h-0">
                  <div
                    v-if="(waitingForFirstChunk || isGeneratingMissionGuide) && !missionGuide"
                    class="flex flex-col items-center justify-center gap-3 py-8"
                  >
                    <SparklesIcon class="w-5 h-5 animate-pulse text-navy-700" />
                    <span class="text-sm text-text-secondary"
                      >Generando guía para los alumnos...</span
                    >
                    <AILoadingBar
                      v-if="generationProgress > 0 || isOvertime"
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                      :remaining-label="remainingTimeLabel"
                    />
                  </div>
                  <div
                    v-else-if="missionGuideGenerationFailed && !missionGuide"
                    class="flex flex-col items-center gap-4 text-text-secondary py-8"
                  >
                    <p class="text-sm">No se pudo generar la guía.</p>
                    <Button variant="primary" size="sm" @click="generateMissionGuide()">
                      <ArrowPathIcon class="w-4 h-4 mr-2" />
                      Reintentar
                    </Button>
                  </div>
                  <template v-else>
                    <div class="md-rendered" v-html="renderPageMarkdown(missionGuide)" />
                    <div v-if="!isStreaming && missionGuide" class="mt-2 flex justify-end">
                      <AIProviderBadge :provider="guideProvider" />
                    </div>
                  </template>
                </div>
                <div
                  v-if="!isGeneratingMissionGuide && missionGuide && showMissionGuideFeedback"
                  class="onb-feedback"
                >
                  <input
                    ref="missionGuideFeedbackRef"
                    v-model="missionGuideFeedback"
                    type="text"
                    placeholder="Ej: Hazlo más épico, añade consejos para los enigmas..."
                    class="onb-feedback-input"
                    @keydown.enter.prevent="missionGuideFeedback.trim() && regenerateMissionGuide()"
                  />
                  <button
                    type="button"
                    class="onb-cancel-btn"
                    title="Cancelar"
                    @click="showMissionGuideFeedback = false"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="onb-send-btn"
                    :disabled="!missionGuideFeedback.trim() || isGeneratingMissionGuide"
                    @click="regenerateMissionGuide"
                  >
                    <PaperAirplaneIcon class="w-4 h-4" />
                  </button>
                </div>
                <div
                  v-if="
                    !isGeneratingMissionGuide &&
                    !isStreaming &&
                    missionGuide &&
                    !showMissionGuideFeedback
                  "
                  class="onb-actions"
                >
                  <Button variant="outline" size="sm" @click="step = 5">Atrás</Button>
                  <div class="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="showMissionGuideFeedback = true; nextTick(() => missionGuideFeedbackRef?.focus())"
                      >Quiero cambiar algo</Button
                    >
                    <Button
                      variant="outline"
                      size="sm"
                      @click="missionGuide = ''; step = 7"
                      >Saltar</Button
                    >
                    <Button variant="primary" size="sm" @click="step = 7">Sí, adelante</Button>
                  </div>
                </div>
                <div
                  v-else-if="!isGeneratingMissionGuide && showMissionGuideFeedback"
                  class="onb-actions"
                >
                  <Button variant="outline" size="sm" @click="step = 5">Atrás</Button>
                </div>
              </div>

              <!-- STEP 7: Badge -->
              <div v-else-if="step === 7" key="s7" class="flex-1 flex flex-col min-h-0">
                <div class="flex-1 flex items-center justify-center min-h-0">
                  <!-- Generating -->
                  <div
                    v-if="isGeneratingBadge"
                    class="w-full max-w-md flex flex-col items-center gap-3"
                  >
                    <div
                      class="w-32 h-32 rounded-full bg-gray-100 animate-pulse flex items-center justify-center"
                    >
                      <TrophyIcon class="w-12 h-12 text-gray-300" />
                    </div>
                    <SparklesIcon class="w-5 h-5 animate-pulse text-navy-700" />
                    <span class="text-sm text-text-secondary">Generando insignia...</span>
                    <AILoadingBar
                      v-if="generationProgress > 0 || isOvertime"
                      :progress="generationProgress"
                      :is-overtime="isOvertime"
                      :remaining-label="remainingTimeLabel"
                    />
                  </div>
                  <!-- Generated -->
                  <div v-else-if="badgeImageUrl" class="flex flex-col items-center gap-3">
                    <img
                      :src="badgeImageUrl"
                      alt=""
                      class="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                    <h4 class="text-lg font-bold text-navy-700">{{ badgeName }}</h4>
                    <p class="text-sm text-text-secondary text-center max-w-xs">
                      {{ badgeDescription }}
                    </p>
                  </div>
                  <!-- Error -->
                  <div
                    v-else-if="badgeGenerationFailed"
                    class="flex flex-col items-center gap-4 text-text-secondary"
                  >
                    <TrophyIcon class="w-12 h-12 opacity-40" />
                    <p class="text-sm">No se pudo generar la insignia.</p>
                    <Button variant="primary" size="sm" @click="generateBadge()">
                      <ArrowPathIcon class="w-4 h-4 mr-2" />
                      Reintentar
                    </Button>
                  </div>
                </div>
                <div
                  v-if="!isGeneratingBadge && badgeImageUrl && showBadgeFeedback"
                  class="onb-feedback"
                >
                  <input
                    ref="badgeFeedbackRef"
                    v-model="badgeFeedback"
                    type="text"
                    placeholder="Ej: Quiero que sea más épica, con temática de fuego..."
                    class="onb-feedback-input"
                    @keydown.enter.prevent="badgeFeedback.trim() && regenerateBadge()"
                  />
                  <button
                    type="button"
                    class="onb-cancel-btn"
                    title="Cancelar"
                    @click="showBadgeFeedback = false"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    class="onb-send-btn"
                    :disabled="!badgeFeedback.trim() || isGeneratingBadge"
                    @click="regenerateBadge"
                  >
                    <PaperAirplaneIcon class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="!isGeneratingBadge && !showBadgeFeedback" class="onb-actions">
                  <Button variant="outline" size="sm" @click="step = 6">Atrás</Button>
                  <div class="flex gap-2">
                    <Button
                      v-if="badgeImageUrl"
                      variant="outline"
                      size="sm"
                      @click="showBadgeFeedback = true; nextTick(() => badgeFeedbackRef?.focus())"
                      >Quiero cambiar algo</Button
                    >
                    <Button
                      variant="outline"
                      size="sm"
                      @click="badgeName = ''; finishWizard()"
                      >Saltar</Button
                    >
                    <Button v-if="badgeImageUrl" variant="primary" size="sm" @click="finishWizard"
                      >Sí, adelante</Button
                    >
                  </div>
                </div>
                <div v-else-if="!isGeneratingBadge && showBadgeFeedback" class="onb-actions">
                  <Button variant="outline" size="sm" @click="step = 6">Atrás</Button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- PREVIEW -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
      <div class="max-w-md mx-auto">
        <p class="text-sm font-medium text-text-secondary mb-4 text-center">
          Así quedará tu misión
        </p>

        <!-- Mission card preview -->
        <div class="pointer-events-none">
          <MissionCardEnhanced
            id="preview"
            :title="form.title"
            :description="form.description"
            status="activa"
            :rarity="form.rarity"
            :completed-count="0"
            :total-students="0"
            :deadline="form.deadline"
            :xp-reward="totalXp"
            :background-image="generatedImageUrl || rawImagePath"
          />
        </div>

        <p v-if="errors.submit" class="text-sm text-red-600 mt-3 text-center">
          {{ errors.submit }}
        </p>

        <div class="flex justify-center gap-3 mt-6">
          <Button variant="outline" @click="showPreview = false">Atrás</Button>
          <Button variant="primary" :disabled="isSubmitting" @click="handleSubmit">
            <template v-if="isSubmitting">
              <svg class="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando...
            </template>
            <template v-else>Crear Misión</template>
          </Button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body"
      ><Transition name="modal">
        <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" />
          <div
            class="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl text-center"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckIcon class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-navy-700 mb-2">Misión creada!</h3>
            <p class="text-text-secondary mb-6">Tu misión "{{ form.title }}" está lista.</p>
            <div class="flex flex-col gap-2">
              <Button variant="primary" full-width @click="goToMissions">Ver misiones</Button>
              <Button variant="outline" full-width @click="resetWizard">Crear otra</Button>
            </div>
          </div>
        </div>
      </Transition></Teleport
    >
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  ChevronRightIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  CheckIcon,
  PhotoIcon,
  ArrowPathIcon,
  TrophyIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { renderPageMarkdown } from '~/utils/markdown'
import { MISSION_COMPLETION_BONUS, type MissionRarity } from '~/utils/gamification-config'

definePageMeta({ layout: 'teacher', middleware: ['auth', 'role'] })
const { t, locale } = useI18n()
const effects = useEffects()
useHead({ title: () => t('teacher.missions.create.meta.title') })

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const aiStore = useAIAssistantStore()
const teacherStore = useTeacherStore()
const classesStore = useClassesStore()
const missionStore = useMissionStore()

const god = computed(
  () => aiStore.currentGod || { id: 'atenea', name: 'Atenea', avatar: '/app/avatars/atenea.svg' }
)
const teacherName = computed(() => authStore.user?.name?.split(' ')[0] || '')
const teacherClasses = computed(() => classesStore.classes || [])

// Wizard
const totalSteps = 8
const step = ref(0)
const loading = ref(false)
const isStreaming = ref(false)
const showPreview = ref(false)
const showSuccess = ref(false)
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()
const feedbackRef = ref<HTMLInputElement>()
const titleFeedbackRef = ref<HTMLInputElement>()
const enigmaFeedbackRef = ref<HTMLInputElement>()

// Accumulated context
const selectedClassId = ref('')
const idea = ref('')
const narrative = ref('')
const titles = ref<string[]>([])
const selectedTitle = ref('')
const customTitle = ref('')
const chosenTitle = computed(() => customTitle.value.trim() || selectedTitle.value)
const enigmas = ref<
  Array<{ title: string; description: string; xp: number; objectives: string[] }>
>([])
const rarity = ref('comun')
const deadline = ref('')
const feedback = ref('')
const titleFeedback = ref('')
const enigmaFeedback = ref('')
const enigmaRaw = ref('')
const enigmaError = ref('')
const showNarrativeFeedback = ref(false)
const showTitleFeedback = ref(false)
const showEnigmaFeedback = ref(false)
const generatedImageUrl = ref('')
const rawImagePath = ref('')
const isGeneratingImage = ref(false)
const imageGenerationFailed = ref(false)
const imageFeedback = ref('')
const showImageFeedback = ref(false)
const imageFeedbackRef = ref<HTMLInputElement>()
const missionGuide = ref('')
const isGeneratingMissionGuide = ref(false)
const badgeName = ref('')
const badgeDescription = ref('')
const badgeImageUrl = ref('')
const rawBadgeImagePath = ref('')
const isGeneratingBadge = ref(false)
const badgeGenerationFailed = ref(false)
const badgeFeedback = ref('')
const showBadgeFeedback = ref(false)
const badgeFeedbackRef = ref<HTMLInputElement>()
const missionGuideGenerationFailed = ref(false)
const missionGuideFeedback = ref('')
const showMissionGuideFeedback = ref(false)
const missionGuideFeedbackRef = ref<HTMLInputElement>()

const className = computed(
  () => teacherClasses.value.find(c => c.id === selectedClassId.value)?.name || ''
)
const classSelectOptions = computed(() =>
  teacherClasses.value.map(c => ({ value: c.id, label: c.name }))
)
const classMissions = ref<Array<{ title: string; description?: string }>>([])

// Load existing missions when class changes
watch(selectedClassId, async classId => {
  if (!classId) {
    classMissions.value = []
    return
  }
  try {
    const res = await $fetch<{ missions: Array<{ title: string; description?: string }> }>(
      `${config.public.apiBase}/teacher/classes/${classId}`
    )
    classMissions.value =
      (res as any)?.missions?.map((m: any) => ({
        title: m.title,
        description: (m.description || '').slice(0, 200),
      })) || []
  } catch {
    classMissions.value = []
  }
})

const rarities = [
  { value: 'comun', label: 'Común' },
  { value: 'rara', label: 'Rara' },
  { value: 'epica', label: 'Épica' },
  { value: 'legendaria', label: 'Legendaria' },
]

const rarityLabel = computed(() => rarities.find(r => r.value === rarity.value)?.label || 'Común')
const rarityClass = computed(() => {
  const map: Record<string, string> = {
    comun: 'bg-gray-100 text-gray-600',
    rara: 'bg-blue-100 text-blue-700',
    epica: 'bg-purple/10 text-purple',
    legendaria: 'bg-yellow/20 text-yellow-700',
  }
  return map[rarity.value] || map.comun
})

const totalXp = computed(() => {
  const enigmasXp = enigmas.value.reduce((sum, e) => sum + e.xp, 0)
  const rarityBonus = MISSION_COMPLETION_BONUS[rarity.value as MissionRarity] ?? 0
  return enigmasXp + rarityBonus
})

const form = computed(() => ({
  title: chosenTitle.value,
  description: missionGuide.value || narrative.value,
  classId: selectedClassId.value,
  status: 'activa' as const,
  rarity: rarity.value as MissionRarity,
  deadline: deadline.value || undefined,
  backgroundImage: rawImagePath.value || undefined,
  enigmas: enigmas.value.map(e => ({
    title: e.title,
    description: e.description,
    xp: e.xp,
    objectives: e.objectives,
  })),
}))

const errors = reactive({ submit: '' })
const isSubmitting = ref(false)

const currentQuestion = computed(() => {
  const questions = [
    `${teacherName.value ? `${teacherName.value}, ` : ''}¿de qué quieres que sea tu misión?`,
    'Esta es la narrativa que he creado, ¿te gusta?',
    '¿Qué título le ponemos a la misión?',
    'Estos son los enigmas que he preparado',
    'Configuración final',
    'He creado esta portada para tu misión',
    'Esta es la guía para tus alumnos',
    '¿Quieres crear una insignia para esta misión?',
  ]
  return questions[step.value] || ''
})

// Load classes
onMounted(async () => {
  await classesStore.fetchTeacherClasses()
  // Preselect class from query param
  const qClassId = route.query.classId as string
  if (qClassId && teacherClasses.value.some(c => c.id === qClassId)) {
    selectedClassId.value = qClassId
  }
  nextTick(() => inputRef.value?.focus())
})

watch(step, () => {
  showNarrativeFeedback.value = false
  showTitleFeedback.value = false
  showEnigmaFeedback.value = false
  showImageFeedback.value = false
  showMissionGuideFeedback.value = false
  nextTick(() => inputRef.value?.focus())
})

// Context builder
function buildContext() {
  const parts = [`Idea: ${idea.value}`, `Clase: ${className.value}`]
  if (classMissions.value.length > 0) {
    const missionSummaries = classMissions.value
      .map(m => `- "${m.title}": ${m.description?.slice(0, 150) || 'sin descripción'}`)
      .join('\n')
    parts.push(
      `Misiones ya creadas en esta clase:\n${missionSummaries}\n\nLa nueva misión debe ser DIFERENTE, complementar las existentes y avanzar en dificultad o temática respecto a lo que ya hay.`
    )
  }
  if (narrative.value) parts.push(`Narrativa: ${narrative.value.slice(0, 500)}`)
  if (chosenTitle.value) parts.push(`Título: ${chosenTitle.value}`)
  return parts.join('\n')
}

// AI helpers (centralized prompts)
const {
  streamPrompt,
  callPrompt,
  lastProvider,
  generationProgress,
  waitingForFirstChunk,
  isOvertime,
  remainingTimeLabel,
  fetchEstimate,
  startProgress,
  stopProgress,
} = useAIPrompt()
type AIProviderName = 'spark' | 'gemini' | 'flux' | null
const narrativeProvider = ref<AIProviderName>(null)
const enigmasProvider = ref<AIProviderName>(null)
const coverProvider = ref<AIProviderName>(null)
const guideProvider = ref<AIProviderName>(null)

async function streamAI(
  type: string,
  params: Record<string, string>,
  target: Ref<string>,
  providerRef?: Ref<AIProviderName>
) {
  loading.value = false
  isStreaming.value = true
  await streamPrompt(type, params, target)
  if (providerRef) providerRef.value = lastProvider.value
}

async function callAI(type: string, params: Record<string, string>) {
  try {
    const result = await callPrompt(type, params)
    return { message: result }
  } catch {
    return null
  }
}

// Step 0 → 1: Generate narrative
async function submitIdea() {
  if (!idea.value.trim() || !selectedClassId.value || loading.value) return
  step.value = 1
  narrative.value = ''
  loading.value = true
  try {
    await streamAI(
      'mission.narrative.generate',
      { idea: idea.value, className: className.value },
      narrative,
      narrativeProvider
    )
    narrative.value = narrative.value
      .replace(/^(Aqui tienes|Claro|Por supuesto)[^.]*[.:]\s*/i, '')
      .trim()
      .slice(0, 8000)
  } catch {
    narrative.value = idea.value
  } finally {
    loading.value = false
    isStreaming.value = false
  }
}

async function regenerateNarrative() {
  const fb = feedback.value.trim()
  if (!fb) return
  feedback.value = ''
  showNarrativeFeedback.value = false
  const prev = narrative.value
  narrative.value = ''
  loading.value = true
  try {
    await streamAI(
      'mission.narrative.modify',
      { idea: idea.value, current: prev.slice(0, 800), feedback: fb },
      narrative,
      narrativeProvider
    )
    narrative.value = narrative.value
      .replace(/^(Aqui tienes|Claro|Por supuesto)[^.]*[.:]\s*/i, '')
      .trim()
      .slice(0, 8000)
  } catch {
    narrative.value = prev
  } finally {
    loading.value = false
    isStreaming.value = false
  }
}

// Step 1 → 2: Generate titles
async function acceptNarrative() {
  step.value = 2
  loading.value = true
  const est = await fetchEstimate('chat')
  startProgress(est)
  try {
    const ctx = buildContext()
    const res = await callAI('mission.titles.generate', { context: ctx.slice(0, 800) })
    if (res?.message) {
      const match = res.message.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed))
          titles.value = parsed.slice(0, 6).map((t: any) => String(t).slice(0, 80))
      }
    }
  } catch {
  } finally {
    stopProgress()
    loading.value = false
  }
}

async function regenerateTitles() {
  const fb = titleFeedback.value.trim()
  if (!fb) return
  titleFeedback.value = ''
  showTitleFeedback.value = false
  loading.value = true
  titles.value = []
  selectedTitle.value = ''
  const est = await fetchEstimate('chat')
  startProgress(est)
  try {
    const ctx = buildContext()
    const res = await callAI('mission.titles.regenerate', {
      context: ctx.slice(0, 800),
      feedback: fb,
    })
    if (res?.message) {
      const match = res.message.match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed))
          titles.value = parsed.slice(0, 6).map((t: any) => String(t).slice(0, 80))
      }
    }
  } catch {
  } finally {
    stopProgress()
    loading.value = false
  }
}

// Step 2 → 3: Generate enigmas
async function acceptTitle() {
  step.value = 3
  enigmaError.value = ''
  loading.value = true
  try {
    enigmaRaw.value = ''
    const _unused = `Legacy prompt for class "${className.value}":

Idea: ${idea.value}
Narrativa: ${narrative.value.slice(0, 600)}
Título: ${chosenTitle.value}

Genera exactamente 4 ENIGMAS (actividades/tareas reales que los alumnos deben completar). Cada enigma es una actividad concreta y práctica.

IMPORTANTE: El XP de cada enigma SOLO puede ser uno de estos 5 valores exactos:
- 20 XP = tarea sencilla, repaso o introducción
- 40 XP = ejercicio estándar de dificultad media
- 60 XP = actividad que requiere investigación o análisis
- 80 XP = reto complejo que combina varios conceptos
- 100 XP = proyecto o desafío final de alta dificultad

NO uses ningún otro valor de XP. Solo 20, 40, 60, 80 o 100.

Cada enigma tiene objectives (lista de objetivos de aprendizaje, 2-3 por enigma).

Responde SOLO con un JSON array:
[{"title":"Nombre del enigma","description":"Qué tiene que hacer el alumno (2-3 frases)","xp":20,"objectives":["Objetivo 1","Objetivo 2"]}]

SOLO el JSON, nada más.`
    await streamAI(
      'mission.enigmas.generate',
      {
        idea: idea.value,
        narrative: narrative.value,
        title: chosenTitle.value,
        className: className.value,
      },
      enigmaRaw,
      enigmasProvider
    )
    let raw: string = enigmaRaw.value
    // Strip markdown code blocks if present (```json ... ```)
    raw = raw
      .replace(/```(?:json)?\s*/gi, '')
      .replace(/```/g, '')
      .trim()
    // Extract JSON array from response
    const match = raw.match(/\[[\s\S]*\]/)
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed)) {
          const validXp = [20, 40, 60, 80, 100]
          enigmas.value = parsed.map((e: any) => {
            const rawXp = Number(e.xp) || 20
            const xp = validXp.reduce((prev, curr) =>
              Math.abs(curr - rawXp) < Math.abs(prev - rawXp) ? curr : prev
            )
            return {
              title: String(e.title || '').slice(0, 100),
              description: String(e.description || '').slice(0, 300),
              xp,
              objectives: Array.isArray(e.objectives)
                ? e.objectives.map((o: any) => String(o).slice(0, 200))
                : [],
            }
          })
        }
      } catch {
        console.error('Failed to parse enigmas JSON from AI')
      }
    }
    if (enigmas.value.length === 0) {
      enigmaError.value = 'No hemos podido generar los enigmas. Inténtalo de nuevo.'
    }
  } catch (err) {
    enigmaError.value =
      err instanceof Error && err.message
        ? err.message
        : 'El servicio de IA no está disponible ahora mismo. Inténtalo de nuevo en unos minutos.'
  } finally {
    loading.value = false
    isStreaming.value = false
  }
}

async function retryEnigmas() {
  enigmas.value = []
  await acceptTitle()
}

async function regenerateEnigmas() {
  const fb = enigmaFeedback.value.trim()
  if (!fb) return
  enigmaFeedback.value = ''
  showEnigmaFeedback.value = false
  loading.value = true
  const prevEnigmas = JSON.stringify(enigmas.value)
  enigmas.value = []
  try {
    const ctx = buildContext()
    enigmaRaw.value = ''
    const prompt = `Misión para la clase "${className.value}": ${ctx}.

Enigmas actuales: ${prevEnigmas}

El profesor dice: "${fb}".

MODIFICA los enigmas según su feedback. XP SOLO puede ser: 20, 40, 60, 80 o 100. Responde SOLO con un JSON array:
[{"title":"...","description":"...","xp":20,"objectives":["..."]}]
SOLO el JSON.`
    await streamAI(
      'mission.enigmas.regenerate',
      { context: ctx, currentEnigmas: prevEnigmas, feedback: fb, className: className.value },
      enigmaRaw,
      enigmasProvider
    )
    const rawRegen = enigmaRaw.value
      .replace(/```(?:json)?\s*/gi, '')
      .replace(/```/g, '')
      .trim()
    const match = rawRegen.match(/\[[\s\S]*\]/)
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        if (Array.isArray(parsed)) {
          const validXp = [20, 40, 60, 80, 100]
          enigmas.value = parsed.map((e: any) => {
            const rawXp = Number(e.xp) || 20
            const xp = validXp.reduce((prev, curr) =>
              Math.abs(curr - rawXp) < Math.abs(prev - rawXp) ? curr : prev
            )
            return {
              title: String(e.title || '').slice(0, 100),
              description: String(e.description || '').slice(0, 300),
              xp,
              objectives: Array.isArray(e.objectives)
                ? e.objectives.map((o: any) => String(o).slice(0, 200))
                : [],
            }
          })
        }
      } catch {
        console.error('Failed to parse enigmas JSON')
      }
    }
    if (enigmas.value.length === 0) {
      enigmaError.value = 'No hemos podido regenerar los enigmas. Inténtalo de nuevo.'
      try {
        enigmas.value = JSON.parse(prevEnigmas)
      } catch {
        /* keep empty */
      }
    }
  } catch (err) {
    enigmaError.value =
      err instanceof Error && err.message
        ? err.message
        : 'El servicio de IA no está disponible ahora mismo. Inténtalo de nuevo en unos minutos.'
    try {
      enigmas.value = JSON.parse(prevEnigmas)
    } catch {
      /* keep empty */
    }
  } finally {
    loading.value = false
    isStreaming.value = false
  }
}

// Step 5: Cover
watch(step, s => {
  if (s === 5 && !generatedImageUrl.value && !isGeneratingImage.value) generateMissionCover()
})

async function generateMissionCover(extraPrompt?: string) {
  if (isGeneratingImage.value) return
  isGeneratingImage.value = true
  imageGenerationFailed.value = false
  const est = await fetchEstimate('image')
  startProgress(est)
  try {
    const narrativeText = extraPrompt ? `${narrative.value}. ${extraPrompt}` : narrative.value
    const res = await $fetch<{ imageUrl: string; provider?: string }>(
      `${config.public.apiBase}/ai/mission-cover`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.tokens?.accessToken}` },
        body: { title: chosenTitle.value, narrative: narrativeText, locale: locale.value },
      }
    )
    rawImagePath.value = res.imageUrl
    generatedImageUrl.value = res.imageUrl
    if (res.provider) coverProvider.value = res.provider as AIProviderName
  } catch {
    imageGenerationFailed.value = true
  } finally {
    stopProgress()
    isGeneratingImage.value = false
  }
}

async function regenerateMissionCover() {
  const fb = imageFeedback.value.trim()
  if (!fb) return
  imageFeedback.value = ''
  showImageFeedback.value = false
  generatedImageUrl.value = ''
  rawImagePath.value = ''
  await generateMissionCover(fb)
}

// Step 6: Mission guide/guía
watch(step, s => {
  if (s === 6 && !missionGuide.value && !isGeneratingMissionGuide.value) generateMissionGuide()
})

async function generateMissionGuide(extraPrompt?: string) {
  if (isGeneratingMissionGuide.value) return
  isGeneratingMissionGuide.value = true
  missionGuideGenerationFailed.value = false
  missionGuide.value = ''
  try {
    const enigmaSummary = enigmas.value
      .map(e => `- ${e.title} (${e.xp} XP): ${e.description.slice(0, 100)}`)
      .join('\n')
    isGeneratingMissionGuide.value = false
    isStreaming.value = true
    await streamPrompt(
      'mission.guide.generate',
      {
        title: chosenTitle.value,
        narrative: narrative.value,
        enigmasSummary: enigmaSummary,
        totalXp: String(totalXp.value),
      },
      missionGuide
    )
    guideProvider.value = lastProvider.value
    missionGuide.value = missionGuide.value
      .replace(/^(Aqui tienes|Claro|Por supuesto)[^.]*[.:]\s*/i, '')
      .trim()
  } catch {
    missionGuideGenerationFailed.value = true
  } finally {
    isGeneratingMissionGuide.value = false
    isStreaming.value = false
  }
}

async function regenerateMissionGuide() {
  const fb = missionGuideFeedback.value.trim()
  if (!fb) return
  missionGuideFeedback.value = ''
  showMissionGuideFeedback.value = false
  await generateMissionGuide(fb)
}

// Step 7: Badge
watch(step, s => {
  if (s === 7 && !badgeImageUrl.value && !isGeneratingBadge.value) generateBadge()
})

async function generateBadge(extraPrompt?: string) {
  if (isGeneratingBadge.value) return
  isGeneratingBadge.value = true
  badgeGenerationFailed.value = false
  const est = await fetchEstimate('image')
  startProgress(est)
  try {
    // First: generate badge name + description via AI
    if (!badgeName.value) {
      const badgeContext = `Misión "${chosenTitle.value}" de la clase "${className.value}".
Narrativa: ${narrative.value.slice(0, 400)}
Enigmas: ${enigmas.value.map(e => e.title).join(', ')}
Dificultad: ${rarityLabel.value}
IMPORTANTE: el nombre NO puede ser igual al título de la misión ("${chosenTitle.value}"). Debe ser épico y único, representar el LOGRO de completar la misión.`
      const res = await callAI('badge.generate', { context: badgeContext })
      if (res?.message) {
        const rawMsg = res.message
          .replace(/```(?:json)?\s*/gi, '')
          .replace(/```/g, '')
          .trim()
        const match = rawMsg.match(/\{[\s\S]*\}/)
        if (match) {
          const parsed = JSON.parse(match[0])
          badgeName.value = parsed.name || ''
          badgeDescription.value = parsed.description || ''
        }
      }
      if (!badgeName.value) badgeName.value = `Insignia: ${chosenTitle.value}`
    }

    // Then: generate badge image
    const prompt = extraPrompt
      ? `${badgeName.value}. ${badgeDescription.value}. ${extraPrompt}`
      : `${badgeName.value}. ${badgeDescription.value}. Context: ${chosenTitle.value}, ${className.value}`

    const res = await $fetch<{ imageUrl: string }>(`${config.public.apiBase}/ai/badge-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.tokens?.accessToken}` },
      body: {
        prompt,
        name: badgeName.value,
        description: badgeDescription.value,
        locale: locale.value,
      },
    })
    rawBadgeImagePath.value = res.imageUrl
    badgeImageUrl.value = res.imageUrl?.startsWith('http')
      ? res.imageUrl
      : `${config.public.apiBase}${res.imageUrl}`
  } catch {
    badgeGenerationFailed.value = true
  } finally {
    stopProgress()
    isGeneratingBadge.value = false
  }
}

async function regenerateBadge() {
  const fb = badgeFeedback.value.trim()
  if (!fb) return
  badgeFeedback.value = ''
  showBadgeFeedback.value = false
  badgeImageUrl.value = ''
  rawBadgeImagePath.value = ''
  await generateBadge(fb)
}

function finishWizard() {
  showPreview.value = true
}

// Submit
async function handleSubmit() {
  errors.submit = ''
  isSubmitting.value = true
  try {
    const created = await missionStore.createMission(form.value as any)
    // Create badge if generated
    if (badgeName.value && rawBadgeImagePath.value && created?.id) {
      try {
        await $fetch(`${config.public.apiBase}/teacher/badges`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.tokens?.accessToken}` },
          body: {
            name: badgeName.value,
            description: badgeDescription.value,
            imageUrl: rawBadgeImagePath.value,
            rarity:
              rarity.value === 'comun'
                ? 'common'
                : rarity.value === 'rara'
                  ? 'rare'
                  : rarity.value === 'epica'
                    ? 'epic'
                    : 'legendary',
            missionId: created.id,
          },
        })
      } catch {
        /* badge creation failed silently */
      }
    }
    // Invalida caches para que misiones/listas se recarguen al volver.
    missionStore.hasLoadedMissions = false
    missionStore.hasLoadedTeacherMissions = false
    showSuccess.value = true
    // Sparkle + SFX por el composable (mismos gates que el resto del sitio).
    effects.play('enigma_approved')
  } catch (err: any) {
    errors.submit = err?.data?.message || missionStore.error || 'Error al crear la misión'
  } finally {
    isSubmitting.value = false
  }
}

async function goToMissions() {
  showSuccess.value = false
  await teacherStore.fetchStats(true)
  await teacherStore.fetchRecentMissions(undefined, true)
  router.push('/profesor/misiones')
}

function resetWizard() {
  step.value = 0
  idea.value = ''
  narrative.value = ''
  titles.value = []
  selectedTitle.value = ''
  customTitle.value = ''
  enigmas.value = []
  rarity.value = 'comun'
  deadline.value = ''
  generatedImageUrl.value = ''
  rawImagePath.value = ''
  imageGenerationFailed.value = false
  missionGuide.value = ''
  missionGuideGenerationFailed.value = false
  badgeName.value = ''
  badgeDescription.value = ''
  badgeImageUrl.value = ''
  rawBadgeImagePath.value = ''
  badgeGenerationFailed.value = false
  showPreview.value = false
  showSuccess.value = false
}
</script>

<style scoped>
.onb-input {
  @apply w-full px-5 py-4 rounded-2xl bg-gray-50 text-sm text-navy-700 leading-relaxed border border-gray-200 outline-none;
}
.onb-input:focus {
  @apply ring-2 ring-gray-300;
}
.onb-input::placeholder {
  @apply text-text-secondary;
}
.onb-result-box {
  @apply bg-gray-50 rounded-2xl p-5 border border-gray-100;
}
.onb-actions {
  @apply flex items-center justify-between mt-5 pt-4 border-t border-gray-100;
}
.onb-loading {
  @apply flex items-center gap-2 text-text-secondary text-sm;
}
.onb-feedback {
  @apply flex gap-2 mt-4;
}
.onb-feedback-input {
  @apply flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-navy-700 outline-none;
}
.onb-feedback-input:focus {
  @apply ring-2 ring-gray-300;
}
.onb-feedback-input::placeholder {
  @apply text-text-secondary;
}
.onb-send-btn {
  @apply px-3.5 py-2.5 rounded-2xl bg-navy-700 text-white transition-colors;
}
.onb-send-btn:hover {
  @apply opacity-90;
}
.onb-send-btn:disabled {
  @apply opacity-40 cursor-not-allowed;
}
.onb-cancel-btn {
  @apply px-3.5 py-2.5 rounded-2xl bg-gray-100 text-navy-700 border border-gray-200 transition-colors;
}
.onb-cancel-btn:hover {
  @apply bg-gray-200;
}

.title-item-enter-active {
  animation: slideUp 0.3s ease both;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
