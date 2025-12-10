import { PrismaClient, UserRole, VehicleType, RateType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ticketar.com' },
    update: {},
    create: {
      email: 'admin@ticketar.com',
      password: adminPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  });

  // Crear usuario operador
  const operatorPassword = await bcrypt.hash('operador123', 10);
  const operator = await prisma.user.upsert({
    where: { email: 'operador@ticketar.com' },
    update: {},
    create: {
      email: 'operador@ticketar.com',
      password: operatorPassword,
      name: 'Operador',
      role: UserRole.OPERATOR,
    },
  });

  // Crear tarifas
  const rate1 = await prisma.rate.upsert({
    where: { id: 'rate-1' },
    update: {},
    create: {
      id: 'rate-1',
      nombre: 'Tarifa por Hora - Día',
      tipo: RateType.POR_HORA,
      precio: 500,
      horaInicio: 8,
      horaFin: 20,
      activo: true,
    },
  });

  const rate2 = await prisma.rate.upsert({
    where: { id: 'rate-2' },
    update: {},
    create: {
      id: 'rate-2',
      nombre: 'Tarifa por Hora - Noche',
      tipo: RateType.POR_HORA,
      precio: 300,
      horaInicio: 20,
      horaFin: 8,
      activo: true,
    },
  });

  const rate3 = await prisma.rate.upsert({
    where: { id: 'rate-3' },
    update: {},
    create: {
      id: 'rate-3',
      nombre: 'Tarifa por Fracción (15 min)',
      tipo: RateType.POR_FRACCION,
      precio: 150,
      fraccionMin: 15,
      fraccionMax: 15,
      activo: true,
    },
  });

  const rate4 = await prisma.rate.upsert({
    where: { id: 'rate-4' },
    update: {},
    create: {
      id: 'rate-4',
      nombre: 'Tarifa Mensual',
      tipo: RateType.MENSUAL,
      precio: 10000,
      activo: true,
    },
  });

  // Crear configuración
  await prisma.config.upsert({
    where: { key: 'MAX_PARKING_SPACES' },
    update: {},
    create: {
      key: 'MAX_PARKING_SPACES',
      value: '100',
      description: 'Cantidad máxima de plazas de estacionamiento',
    },
  });

  console.log('✅ Seed completado');
  console.log('👤 Admin: admin@ticketar.com / admin123');
  console.log('👤 Operador: operador@ticketar.com / operador123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

