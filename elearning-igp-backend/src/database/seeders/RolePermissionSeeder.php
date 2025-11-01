<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'users.view', 'users.create', 'users.edit', 'users.delete', 'users.toggle-status',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign-permissions',
            'programs.view', 'programs.create', 'programs.edit', 'programs.delete',
            'years.view', 'years.create', 'years.edit', 'years.delete',
            'courses.view-all', 'courses.view-own', 'courses.create', 'courses.edit', 'courses.delete', 'courses.assign-professor',
            'enrollments.view', 'enrollments.create', 'enrollments.delete',
            'materials.upload', 'materials.edit', 'materials.delete', 'materials.download',
            'sessions.create', 'sessions.start', 'sessions.end', 'sessions.join', 'sessions.record',
            'attendance.view', 'attendance.mark', 'attendance.export',
            'grades.view-all', 'grades.view-own', 'grades.assign', 'grades.edit',
            'reports.view', 'reports.export',
            'settings.manage', 'logs.view',
        ];

        // Créer permissions pour web et api guards
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'api']);
        }

        // ROLE ADMIN - WEB
        $adminWeb = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminWeb->syncPermissions(Permission::where('guard_name', 'web')->get());

        // ROLE ADMIN - API
        $adminApi = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $adminApi->syncPermissions(Permission::where('guard_name', 'api')->get());

        // ROLE PROFESSOR - WEB
        $professorWeb = Role::firstOrCreate(['name' => 'professor', 'guard_name' => 'web']);
        $professorWeb->syncPermissions(Permission::where('guard_name', 'web')->whereIn('name', [
            'courses.view-own', 'courses.edit',
            'materials.upload', 'materials.edit', 'materials.delete',
            'sessions.create', 'sessions.start', 'sessions.end', 'sessions.record',
            'attendance.view', 'attendance.mark',
            'grades.view-all', 'grades.assign', 'grades.edit',
            'enrollments.view',
        ])->get());

        // ROLE PROFESSOR - API
        $professorApi = Role::firstOrCreate(['name' => 'professor', 'guard_name' => 'api']);
        $professorApi->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', [
            'courses.view-own', 'courses.edit',
            'materials.upload', 'materials.edit', 'materials.delete',
            'sessions.create', 'sessions.start', 'sessions.end', 'sessions.record',
            'attendance.view', 'attendance.mark',
            'grades.view-all', 'grades.assign', 'grades.edit',
            'enrollments.view',
        ])->get());

        // ROLE STUDENT - WEB
        $studentWeb = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $studentWeb->syncPermissions(Permission::where('guard_name', 'web')->whereIn('name', [
            'courses.view-own',
            'materials.download',
            'sessions.join',
            'grades.view-own',
        ])->get());

        // ROLE STUDENT - API
        $studentApi = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'api']);
        $studentApi->syncPermissions(Permission::where('guard_name', 'api')->whereIn('name', [
            'courses.view-own',
            'materials.download',
            'sessions.join',
            'grades.view-own',
        ])->get());
    }
}