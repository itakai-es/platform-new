import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
// ==================== DEMO DATA (copied from frontend mocks) ====================
const USER_IDS = {
    DEMO_STUDENT: 'demo_student',
    DEMO_TEACHER: 'demo_teacher',
    DEMO_ADMIN: 'demo_admin',
};
const CLASS_IDS = {
    CLASS_1: 'class-1', // Matemáticas 3º ESO A
    CLASS_2: 'class-2', // Historia 3º ESO A
    CLASS_3: 'class-3', // Álgebra Avanzada
    CLASS_4: 'class-4', // Geometría
    CLASS_5: 'class-5', // Cálculo
    CLASS_6: 'class-6', // Física y Química 3º ESO
    CLASS_7: 'class-7', // Lengua 2º ESO B
};
// Demo users
const DEMO_USERS = [
    {
        id: USER_IDS.DEMO_STUDENT,
        email: 'student@demo.com',
        password: 'demo',
        name: 'Estudiante Demo',
        username: 'LoboValiente34',
        role: 'student',
        isOnboarded: true,
        level: 5,
        xp: 850,
    },
    {
        id: USER_IDS.DEMO_TEACHER,
        email: 'teacher@demo.com',
        password: 'demo',
        name: 'Prof. García',
        username: null,
        role: 'teacher',
        isOnboarded: true,
        level: 1,
        xp: 0,
    },
    {
        id: USER_IDS.DEMO_ADMIN,
        email: 'admin@demo.com',
        password: 'demo',
        name: 'Admin Demo',
        username: null,
        role: 'admin',
        isOnboarded: true,
        level: 1,
        xp: 0,
    },
];
// Additional teachers
const TEACHERS = [
    { id: 'teacher-1', email: 'martinez@demo.com', name: 'Prof. Martínez' },
    { id: 'teacher-2', email: 'lopez@demo.com', name: 'Prof. López' },
    { id: 'teacher-3', email: 'sanchez@demo.com', name: 'Prof. Sánchez' },
];
// Classes
const CLASSES = [
    {
        id: CLASS_IDS.CLASS_1,
        name: 'Matemáticas 3º ESO A',
        description: 'Domina los secretos arcanos de los números. Ecuaciones, funciones y geometría te esperan en este gremio.',
        schedule: 'Lun y Mié 14:00-15:30',
        invitationCode: 'MAT3A1',
        teacherId: USER_IDS.DEMO_TEACHER,
        backgroundImage: '/app/fondos/ecuaciones-basicas.jpg',
    },
    {
        id: CLASS_IDS.CLASS_2,
        name: 'Historia 3º ESO A',
        description: 'Viaja a través del tiempo y descubre las épicas batallas que forjaron nuestro mundo.',
        schedule: 'Mar y Jue 10:00-11:30',
        invitationCode: 'HIS3B2',
        teacherId: USER_IDS.DEMO_TEACHER,
        backgroundImage: '/app/fondos/edad-media.png',
    },
    {
        id: CLASS_IDS.CLASS_3,
        name: 'Álgebra Avanzada 4º ESO',
        description: 'Domina el arte de las ecuaciones y sistemas algebraicos.',
        schedule: 'Lun y Mié 16:00-17:30',
        invitationCode: 'ALG4C3',
        teacherId: 'teacher-1',
        backgroundImage: '/app/fondos/desafio-algebra.png',
    },
    {
        id: CLASS_IDS.CLASS_4,
        name: 'Geometría 2º ESO',
        description: 'Explora el mundo de las formas y el espacio.',
        schedule: 'Mar y Vie 09:00-10:30',
        invitationCode: 'GEO2D4',
        teacherId: 'teacher-2',
        backgroundImage: '/app/fondos/teorema-dragon.jpeg',
    },
    {
        id: CLASS_IDS.CLASS_5,
        name: 'Cálculo 1º Bach',
        description: 'Introducción al cálculo diferencial e integral.',
        schedule: 'Lun, Mié y Vie 11:00-12:00',
        invitationCode: 'CAL1E5',
        teacherId: 'teacher-3',
        backgroundImage: '/app/fondos/conquistador-sistemas.png',
    },
    {
        id: CLASS_IDS.CLASS_6,
        name: 'Física y Química 3º ESO A',
        description: 'El laboratorio de los alquimistas. Transforma la materia y domina las fuerzas del universo.',
        schedule: 'Mié y Vie 11:30-13:00',
        invitationCode: 'FYQ3F6',
        teacherId: USER_IDS.DEMO_TEACHER,
        backgroundImage: '/app/fondos/fisica-quimica-alquimistas.png',
    },
    {
        id: CLASS_IDS.CLASS_7,
        name: 'Lengua 2º ESO B',
        description: 'Academia de bardos y narradores. Domina el arte de la palabra escrita y hablada.',
        schedule: 'Lun y Jue 09:00-10:30',
        invitationCode: 'LEN2G7',
        teacherId: 'teacher-1',
        backgroundImage: '/app/fondos/lengua-academia-bardos.png',
    },
];
// Missions
const MISSIONS = [
    // Matemáticas
    {
        id: 'mission-1',
        classId: CLASS_IDS.CLASS_1,
        title: 'El Desafío del Álgebra Suprema',
        description: 'Domina las ecuaciones de primer y segundo grado para avanzar.',
        status: 'activa',
        difficulty: 'principal',
        rarity: 'rara',
        xpReward: 150,
        coinsReward: 75,
        backgroundImage: '/app/fondos/desafio-algebra.png',
    },
    {
        id: 'mission-2',
        classId: CLASS_IDS.CLASS_1,
        title: 'Conquistador de Sistemas',
        description: 'Resuelve sistemas de ecuaciones lineales usando múltiples métodos.',
        status: 'activa',
        difficulty: 'experto',
        rarity: 'epica',
        xpReward: 200,
        coinsReward: 100,
        backgroundImage: '/app/fondos/conquistador-sistemas.png',
    },
    {
        id: 'mission-3',
        classId: CLASS_IDS.CLASS_1,
        title: 'Maestro de Ecuaciones Básicas',
        description: 'Completa ejercicios de ecuaciones de primer grado.',
        status: 'activa',
        difficulty: 'facil',
        rarity: 'comun',
        xpReward: 100,
        coinsReward: 50,
        backgroundImage: '/app/fondos/ecuaciones-basicas.jpg',
    },
    {
        id: 'mission-4',
        classId: CLASS_IDS.CLASS_1,
        title: 'El Teorema del Dragón',
        description: 'Demuestra el teorema de Pitágoras y sus aplicaciones.',
        status: 'bloqueada',
        difficulty: 'legendaria',
        rarity: 'legendaria',
        xpReward: 300,
        coinsReward: 150,
        backgroundImage: '/app/fondos/teorema-dragon.jpeg',
    },
    // Historia
    {
        id: 'hist-mission-1',
        classId: CLASS_IDS.CLASS_2,
        title: 'La Revolución Industrial',
        description: 'Explora los cambios tecnológicos y sociales del siglo XVIII.',
        status: 'activa',
        difficulty: 'principal',
        rarity: 'rara',
        xpReward: 150,
        coinsReward: 75,
        backgroundImage: '/app/fondos/revolucion-industrial.png',
    },
    {
        id: 'hist-mission-2',
        classId: CLASS_IDS.CLASS_2,
        title: 'Era de los Descubrimientos',
        description: 'Navega por los grandes viajes de exploración.',
        status: 'activa',
        difficulty: 'experto',
        rarity: 'epica',
        xpReward: 200,
        coinsReward: 100,
        backgroundImage: '/app/fondos/era-descubrimientos.jpg',
    },
    {
        id: 'hist-mission-3',
        classId: CLASS_IDS.CLASS_2,
        title: 'Edad Media en Europa',
        description: 'Descubre la vida en los castillos y feudos medievales.',
        status: 'activa',
        difficulty: 'facil',
        rarity: 'comun',
        xpReward: 100,
        coinsReward: 50,
        backgroundImage: '/app/fondos/edad-media.png',
    },
    // Física y Química
    {
        id: 'fyq-mission-1',
        classId: CLASS_IDS.CLASS_6,
        title: 'La Tabla Periódica',
        description: 'Domina los elementos y sus propiedades.',
        status: 'activa',
        difficulty: 'principal',
        rarity: 'rara',
        xpReward: 150,
        coinsReward: 75,
        backgroundImage: '/app/fondos/tabla-periodica.png',
    },
    {
        id: 'fyq-mission-2',
        classId: CLASS_IDS.CLASS_6,
        title: 'Leyes del Movimiento',
        description: 'Comprende las leyes de Newton y su aplicación.',
        status: 'activa',
        difficulty: 'experto',
        rarity: 'epica',
        xpReward: 200,
        coinsReward: 100,
        backgroundImage: '/app/fondos/leyes-movimiento.png',
    },
    {
        id: 'fyq-mission-3',
        classId: CLASS_IDS.CLASS_6,
        title: 'Estados de la Materia',
        description: 'Explora sólidos, líquidos, gases y plasma.',
        status: 'activa',
        difficulty: 'facil',
        rarity: 'comun',
        xpReward: 100,
        coinsReward: 50,
        backgroundImage: '/app/fondos/estados-materia.png',
    },
    {
        id: 'fyq-mission-4',
        classId: CLASS_IDS.CLASS_6,
        title: 'El Gran Experimento',
        description: 'Diseña y ejecuta un experimento científico completo.',
        status: 'activa',
        difficulty: 'legendaria',
        rarity: 'legendaria',
        xpReward: 300,
        coinsReward: 150,
        backgroundImage: '/app/fondos/gran-experimento.png',
    },
];
// Sample students (45 students with random data)
const STUDENT_NAMES = [
    'Sofía García', 'Miguel López', 'Lucía Martínez', 'Carlos Rodríguez', 'Ana Fernández',
    'David Sánchez', 'Laura Pérez', 'Pablo González', 'María Díaz', 'Javier Moreno',
    'Carmen Ruiz', 'Daniel Jiménez', 'Isabel Hernández', 'Alejandro Álvarez', 'Paula Romero',
    'Alberto Torres', 'Sara Domínguez', 'Adrián Vargas', 'Elena Castro', 'Hugo Ramos',
    'Claudia Blanco', 'Diego Molina', 'Natalia Ortega', 'Sergio Delgado', 'Patricia Guerrero',
    'Rubén Medina', 'Cristina Vega', 'Óscar Campos', 'Marta Reyes', 'Iván Herrera',
    'Silvia Aguilar', 'Fernando Muñoz', 'Beatriz León', 'Raúl Navarro', 'Alicia Santos',
    'Jorge Iglesias', 'Eva Cano', 'Manuel Prieto', 'Rosa Gil', 'Andrés Méndez',
    'Irene Flores', 'Francisco Cruz', 'Raquel Serrano', 'Roberto Núñez', 'Teresa Marín',
];
const USERNAMES = [
    'DragonMath99', 'LoboHistoria', 'AguiLucía', 'TigerCarlos', 'PandaAna',
    'HalconDavid', 'DelfinLaura', 'LeonPablo', 'PhoenixMaria', 'TiburonJavi',
    'CometaCarmen', 'NinjaD4n', 'EstrellaBel', 'RayoAlex', 'LunaP4u',
    'TormentaAlb', 'AuroraSara', 'VorticeAdri', 'NebulosaElena', 'MeteorHugo',
    'CristalClaudia', 'TerremotoDiego', 'NatsStar', 'VolcanSergio', 'OndaPat',
    'RelampagoRuben', 'MisticaCris', 'TruenOscar', 'VientoMarta', 'FuegoIvan',
    'NieveSilvia', 'TornadoFer', 'ArcoirisBea', 'CentellRaul', 'BrillAlicia',
    'HuracanJorge', 'CascadaEva', 'RelampManu', 'FloresRosa', 'RioAndres',
    'MontañaIrene', 'SelvaFran', 'OceanoRaquel', 'DesiertoRob', 'BosqueTere',
];
// Badges
const BADGES = [
    {
        id: 'badge-hermes',
        name: 'Alas de Hermes',
        description: 'Completa una racha de 7 días consecutivos',
        imageUrl: '/uploads/badges/hermes.png',
        category: 'streak',
        rarity: 'rare',
    },
    {
        id: 'badge-heroe',
        name: 'Templo del Héroe',
        description: 'Completa tu primera misión',
        imageUrl: '/uploads/badges/heroe.png',
        category: 'missions',
        rarity: 'common',
    },
    {
        id: 'badge-laurel',
        name: 'Corona de Laurel',
        description: 'Alcanza el nivel 10',
        imageUrl: '/uploads/badges/laurel.png',
        category: 'level',
        rarity: 'epic',
    },
    {
        id: 'badge-helios',
        name: 'Bendición de Helios',
        description: 'Entrega 5 misiones antes de la fecha límite',
        imageUrl: '/uploads/badges/helios.png',
        category: 'missions',
        rarity: 'rare',
    },
    {
        id: 'badge-atenea',
        name: 'Égida de Atenea',
        description: 'Completa 10 misiones con puntuación perfecta',
        imageUrl: '/uploads/badges/atenea.png',
        category: 'performance',
        rarity: 'legendary',
    },
    {
        id: 'badge-poseidon',
        name: 'Tridente de Poseidón',
        description: 'Acumula 5000 puntos de experiencia',
        imageUrl: '/uploads/badges/poseidon.png',
        category: 'xp',
        rarity: 'epic',
    },
];
// Achievements
const ACHIEVEMENTS = [
    { id: 'ach-1', name: 'Primera Misión', description: 'Completa tu primera misión', icon: '🎯', category: 'missions', rarity: 'common', targetValue: 1 },
    { id: 'ach-2', name: 'Racha 7 días', description: 'Mantén una racha de 7 días', icon: '🔥', category: 'streak', rarity: 'rare', targetValue: 7 },
    { id: 'ach-3', name: 'Experto XP', description: 'Acumula 1000 XP', icon: '⭐', category: 'xp', rarity: 'rare', targetValue: 1000 },
    { id: 'ach-4', name: 'Veterano', description: 'Completa 10 misiones', icon: '🏆', category: 'missions', rarity: 'epic', targetValue: 10 },
    { id: 'ach-5', name: 'Explorador', description: 'Únete a 3 clases', icon: '🗺️', category: 'exploration', rarity: 'common', targetValue: 3 },
    { id: 'ach-6', name: 'Maestro XP', description: 'Acumula 5000 XP', icon: '💫', category: 'xp', rarity: 'legendary', targetValue: 5000 },
    { id: 'ach-7', name: 'Social', description: 'Añade 5 amigos', icon: '👥', category: 'social', rarity: 'rare', targetValue: 5 },
    { id: 'ach-8', name: 'Racha 30 días', description: 'Mantén una racha de 30 días', icon: '🔥', category: 'streak', rarity: 'legendary', targetValue: 30 },
    { id: 'ach-9', name: 'Imparable', description: 'Completa 50 misiones', icon: '⚡', category: 'missions', rarity: 'legendary', targetValue: 50 },
    { id: 'ach-10', name: 'Descubridor', description: 'Explora todas las secciones', icon: '🔍', category: 'exploration', rarity: 'rare', targetValue: 1 },
];
// ==================== SEED FUNCTION ====================
async function main() {
    console.log('🌱 Starting database seed...\n');
    // 1. Create demo users
    console.log('Creating demo users...');
    for (const user of DEMO_USERS) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                email: user.email,
                passwordHash: await bcrypt.hash(user.password, 10),
                name: user.name,
                username: user.username,
                role: user.role,
                isOnboarded: user.isOnboarded,
                level: user.level,
                xp: user.xp,
            },
        });
    }
    console.log(`  ✅ ${DEMO_USERS.length} demo users created`);
    // 2. Create additional teachers
    console.log('Creating teachers...');
    for (const teacher of TEACHERS) {
        await prisma.user.upsert({
            where: { id: teacher.id },
            update: {},
            create: {
                id: teacher.id,
                email: teacher.email,
                passwordHash: await bcrypt.hash('demo', 10),
                name: teacher.name,
                role: 'teacher',
                isOnboarded: true,
            },
        });
    }
    console.log(`  ✅ ${TEACHERS.length} teachers created`);
    // 3. Create sample students
    console.log('Creating students...');
    const students = STUDENT_NAMES.map((name, i) => ({
        id: `student-${i + 1}`,
        email: `${USERNAMES[i].toLowerCase()}@estudiante.es`,
        name,
        username: USERNAMES[i],
        level: Math.floor(Math.random() * 8) + 1,
        xp: Math.floor(Math.random() * 1200) + 150,
    }));
    for (const student of students) {
        await prisma.user.upsert({
            where: { id: student.id },
            update: {},
            create: {
                id: student.id,
                email: student.email,
                passwordHash: await bcrypt.hash('demo123', 10),
                name: student.name,
                username: student.username,
                role: 'student',
                isOnboarded: true,
                level: student.level,
                xp: student.xp,
            },
        });
    }
    console.log(`  ✅ ${students.length} students created`);
    // 4. Create classes
    console.log('Creating classes...');
    for (const cls of CLASSES) {
        await prisma.class.upsert({
            where: { id: cls.id },
            update: {},
            create: {
                id: cls.id,
                name: cls.name,
                description: cls.description,
                schedule: cls.schedule,
                invitationCode: cls.invitationCode,
                teacherId: cls.teacherId,
                backgroundImage: cls.backgroundImage,
            },
        });
    }
    console.log(`  ✅ ${CLASSES.length} classes created`);
    // 5. Create enrollments
    console.log('Creating enrollments...');
    let enrollmentCount = 0;
    // Enroll demo student in 3 classes
    const demoStudentClasses = [CLASS_IDS.CLASS_1, CLASS_IDS.CLASS_2, CLASS_IDS.CLASS_6];
    for (const classId of demoStudentClasses) {
        await prisma.classEnrollment.upsert({
            where: { studentId_classId: { studentId: USER_IDS.DEMO_STUDENT, classId } },
            update: {},
            create: { studentId: USER_IDS.DEMO_STUDENT, classId },
        });
        enrollmentCount++;
    }
    // Distribute students across classes
    for (const student of students) {
        // Each student enrolls in 2-4 random classes
        const numClasses = Math.floor(Math.random() * 3) + 2;
        const shuffledClasses = [...Object.values(CLASS_IDS)].sort(() => Math.random() - 0.5);
        const selectedClasses = shuffledClasses.slice(0, numClasses);
        for (const classId of selectedClasses) {
            await prisma.classEnrollment.upsert({
                where: { studentId_classId: { studentId: student.id, classId } },
                update: {},
                create: { studentId: student.id, classId },
            });
            enrollmentCount++;
        }
    }
    console.log(`  ✅ ${enrollmentCount} enrollments created`);
    // 6. Create missions
    console.log('Creating missions...');
    for (const mission of MISSIONS) {
        await prisma.mission.upsert({
            where: { id: mission.id },
            update: {},
            create: {
                id: mission.id,
                classId: mission.classId,
                title: mission.title,
                description: mission.description,
                status: mission.status,
                difficulty: mission.difficulty,
                rarity: mission.rarity,
                xpReward: mission.xpReward,
                coinsReward: mission.coinsReward,
                backgroundImage: mission.backgroundImage,
            },
        });
        // Create 3-4 enigmas per mission
        const numEnigmas = Math.floor(Math.random() * 2) + 3;
        for (let i = 0; i < numEnigmas; i++) {
            await prisma.missionEnigma.create({
                data: {
                    missionId: mission.id,
                    title: `Enigma ${i + 1}`,
                    description: `Completa el paso ${i + 1} de la misión`,
                    orderIndex: i,
                },
            });
        }
    }
    console.log(`  ✅ ${MISSIONS.length} missions created`);
    // 7. Create badges
    console.log('Creating badges...');
    for (const badge of BADGES) {
        await prisma.badge.upsert({
            where: { id: badge.id },
            update: {},
            create: {
                id: badge.id,
                name: badge.name,
                description: badge.description,
                imageUrl: badge.imageUrl,
                category: badge.category,
                rarity: badge.rarity,
            },
        });
    }
    console.log(`  ✅ ${BADGES.length} badges created`);
    // 8. Create achievements
    console.log('Creating achievements...');
    for (const achievement of ACHIEVEMENTS) {
        await prisma.achievement.upsert({
            where: { id: achievement.id },
            update: {},
            create: {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                category: achievement.category,
                rarity: achievement.rarity,
                targetValue: achievement.targetValue,
            },
        });
    }
    console.log(`  ✅ ${ACHIEVEMENTS.length} achievements created`);
    // 9. Give demo student some badges
    console.log('Assigning badges to demo student...');
    await prisma.studentBadge.upsert({
        where: { studentId_badgeId: { studentId: USER_IDS.DEMO_STUDENT, badgeId: 'badge-heroe' } },
        update: {},
        create: { studentId: USER_IDS.DEMO_STUDENT, badgeId: 'badge-heroe' },
    });
    await prisma.studentBadge.upsert({
        where: { studentId_badgeId: { studentId: USER_IDS.DEMO_STUDENT, badgeId: 'badge-hermes' } },
        update: {},
        create: { studentId: USER_IDS.DEMO_STUDENT, badgeId: 'badge-hermes' },
    });
    console.log(`  ✅ 2 badges assigned`);
    console.log('\n✨ Seed completed successfully!\n');
    console.log('Demo credentials:');
    console.log('  Student: student@demo.com / demo');
    console.log('  Teacher: teacher@demo.com / demo');
    console.log('  Admin:   admin@demo.com / demo');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map