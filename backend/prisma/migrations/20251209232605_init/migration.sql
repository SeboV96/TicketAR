-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('AUTO', 'MOTO', 'CAMION', 'OTRO');

-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('POR_HORA', 'POR_FRACCION', 'POR_ESTADIA', 'MENSUAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVO', 'FINALIZADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "patente" TEXT NOT NULL,
    "tipo" "VehicleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "RateType" NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "fraccionMin" DOUBLE PRECISION,
    "fraccionMax" DOUBLE PRECISION,
    "horaInicio" INTEGER,
    "horaFin" INTEGER,
    "diaSemana" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonos" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT,
    "rateId" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abonos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "rateId" TEXT,
    "patente" TEXT NOT NULL,
    "tipoVehiculo" "VehicleType" NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3),
    "monto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "horas" DOUBLE PRECISION,
    "minutos" DOUBLE PRECISION,
    "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVO',
    "operadorIngreso" TEXT NOT NULL,
    "operadorSalida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_patente_key" ON "vehicles"("patente");

-- CreateIndex
CREATE UNIQUE INDEX "configs_key_key" ON "configs"("key");

-- AddForeignKey
ALTER TABLE "abonos" ADD CONSTRAINT "abonos_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos" ADD CONSTRAINT "abonos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos" ADD CONSTRAINT "abonos_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "rates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_operadorIngreso_fkey" FOREIGN KEY ("operadorIngreso") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_operadorSalida_fkey" FOREIGN KEY ("operadorSalida") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
