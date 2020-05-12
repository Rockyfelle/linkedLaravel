<?php

use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'privateTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'publicTag',
            'perm_read' => 'public',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'friendTag',
            'perm_read' => 'friends',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'privateLinkTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => 'aaBBaaBB',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'friendWriteFriendTag',
            'perm_read' => 'friends',
            'perm_write' => 'friends',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'publicWriteWhitelist',
            'perm_read' => 'public',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
            'user_id' => '4',
            'name' => 'whiteListTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => '',
        ]);
    }
}
