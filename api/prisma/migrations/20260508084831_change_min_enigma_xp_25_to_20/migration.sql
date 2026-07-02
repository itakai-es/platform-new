-- The minimum enigma XP preset changed from 25 to 20.
-- Migrate any existing enigmas using the old minimum so the closed preset
-- list [20, 40, 60, 80, 100] stays consistent across the data set.
UPDATE "mission_enigmas" SET "xp_reward" = 20 WHERE "xp_reward" = 25;
