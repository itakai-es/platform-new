import { registerTeacherTools } from './teacher-tools.js'

let initialized = false

export function initializeTools() {
  if (initialized) return
  registerTeacherTools()
  initialized = true
}

export { getToolDeclarations, getTool, getAllTools } from './tool-registry.js'
