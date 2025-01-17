-- CreateTable
CREATE TABLE "country" (
    "country_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country_code" CHAR(3) NOT NULL,
    "phone_code" VARCHAR(6),
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("country_id")
);

-- CreateTable
CREATE TABLE "department_role_trans" (
    "dept_role_id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "department_role_trans_pkey" PRIMARY KEY ("dept_role_id")
);

-- CreateTable
CREATE TABLE "departments" (
    "department_id" SERIAL NOT NULL,
    "department_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "modules" (
    "module_id" SERIAL NOT NULL,
    "module_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_permission_id" SERIAL NOT NULL,
    "screen_id" INTEGER NOT NULL,
    "dept_role_id" INTEGER NOT NULL,
    "can_create" BOOLEAN DEFAULT false,
    "can_edit" BOOLEAN DEFAULT false,
    "can_view" BOOLEAN DEFAULT true,
    "can_delete" BOOLEAN DEFAULT false,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_permission_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "screens" (
    "screen_id" SERIAL NOT NULL,
    "screen_name" VARCHAR(255) NOT NULL,
    "module_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("screen_id")
);

-- CreateTable
CREATE TABLE "user_department_role_trans" (
    "user_dept_role_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "dept_role_id" INTEGER NOT NULL,
    "active" BOOLEAN,

    CONSTRAINT "user_department_role_trans_pkey" PRIMARY KEY ("user_dept_role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "active" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_role_trans_department_id_role_id_key" ON "department_role_trans"("department_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_name_key" ON "departments"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "modules_module_name_key" ON "modules"("module_name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_screen_id_dept_role_id_key" ON "role_permissions"("screen_id", "dept_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "screens_screen_name_key" ON "screens"("screen_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_department_role_trans_user_id_dept_role_id_key" ON "user_department_role_trans"("user_id", "dept_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "department_role_trans" ADD CONSTRAINT "department_role_trans_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_role_trans" ADD CONSTRAINT "department_role_trans_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_dept_role_id_fkey" FOREIGN KEY ("dept_role_id") REFERENCES "department_role_trans"("dept_role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "screens"("screen_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("module_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_department_role_trans" ADD CONSTRAINT "user_department_role_trans_dept_role_id_fkey" FOREIGN KEY ("dept_role_id") REFERENCES "department_role_trans"("dept_role_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_department_role_trans" ADD CONSTRAINT "user_department_role_trans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
