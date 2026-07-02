-- After bajar xp_reward de 25 a 20 en la migración previa
-- (20260508084831_change_min_enigma_xp_25_to_20), quedaron entregas
-- aprobadas con xp_awarded=25 sobre enigmas que ahora valen 20, lo que
-- viola la nueva invariante xp_awarded ≤ xp_reward.
--
-- Este fix es idempotente: solo afecta filas donde xp_awarded/xp_earned
-- supera al xp_reward del enigma. Si la BD está limpia no toca nada.
-- Para mantener la coherencia del XP acumulado, también ajusta el
-- class_enrollments.xp restando exactamente la diferencia.

-- 1. Recalcular el delta de XP a restar por (alumno, clase) ANTES de tocar nada.
WITH delta AS (
  SELECT s.student_id, m.class_id, SUM(s.xp_awarded - e.xp_reward) AS overshoot
  FROM enigma_submissions s
  JOIN mission_enigmas e ON e.id = s.enigma_id
  JOIN missions m ON m.id = e.mission_id
  WHERE s.xp_awarded IS NOT NULL AND s.xp_awarded > e.xp_reward
  GROUP BY s.student_id, m.class_id
)
UPDATE class_enrollments ce
SET xp = GREATEST(0, ce.xp - delta.overshoot)
FROM delta
WHERE ce.student_id = delta.student_id AND ce.class_id = delta.class_id;

-- 2. Bajar xp_awarded al máximo permitido por el enigma actual.
UPDATE enigma_submissions s
SET xp_awarded = e.xp_reward
FROM mission_enigmas e
WHERE s.enigma_id = e.id
  AND s.xp_awarded IS NOT NULL
  AND s.xp_awarded > e.xp_reward;

-- 3. Bajar xp_earned en student_enigma_progress al mismo cap.
UPDATE student_enigma_progress sep
SET xp_earned = e.xp_reward
FROM mission_enigmas e
WHERE sep.enigma_id = e.id
  AND sep.xp_earned > e.xp_reward;

-- 4. Alinear el XP histórico mostrado en el feed de actividad.
-- Solo actualiza activities cuyo enigma_title coincide con un enigma cuyo
-- xp_reward es menor que el enigma_xp registrado.
UPDATE activities a
SET enigma_xp = e.xp_reward
FROM mission_enigmas e
WHERE a.enigma_title = e.title
  AND a.enigma_xp IS NOT NULL
  AND a.enigma_xp > e.xp_reward
  AND a.type = 'enigma_completed';
