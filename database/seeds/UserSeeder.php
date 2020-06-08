<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'private',
            'email' => 'private@local.com',
            'username' => 'private',
			'password' => '1',
			'tagvisibility' => 'private',
        ]);
        
        DB::table('users')->insert([
            'name' => 'public',
            'email' => 'public@local.com',
			'username' => 'public',
			'tagvisibility' => 'private',
            'password' => '1',
        ]);

        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@local.com',
            'username' => 'admin',
			'password' => '1',
			'tagvisibility' => 'private',
        ]);

        DB::table('users')->insert([
            'name' => 'User 1',
            'email' => 'user1@gmail.com',
            'username' => 'user1',
			'password' => Hash::make('password'),
			'tagvisibility' => 'private',
        ]);

        DB::table('users')->insert([
            'name' => 'User1\'s Friend',
            'email' => 'user2@gmail.com',
            'username' => 'user1friend',
			'password' => Hash::make('password'),
			'tagvisibility' => 'friends',
        ]);

        DB::table('users')->insert([
            'name' => 'User 3',
            'email' => 'user3@gmail.com',
            'username' => 'user3',
			'password' => Hash::make('password'),
			'tagvisibility' => 'public',
        ]);
    }
}
