export const useMissions = () => {
  const isOverdue = (dueDate: Date | string): boolean => {
    return new Date(dueDate) < new Date()
  }

  return {
    isOverdue,
  }
}
