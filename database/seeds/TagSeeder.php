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
			'id' => '1',
            'user_id' => '1',
            'name' => 'privateTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
			'id' => '2',
            'user_id' => '1',
            'name' => 'publicTag',
            'perm_read' => 'public',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
			'id' => '3',
            'user_id' => '1',
            'name' => 'friendTag',
            'perm_read' => 'friends',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
			'id' => '4',
            'user_id' => '1',
            'name' => 'privateLinkTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => 'aaBBaaBB',
        ]);

        DB::table('tags')->insert([
			'id' => '5',
            'user_id' => '1',
            'name' => 'friendWriteFriendTag',
            'perm_read' => 'friends',
            'perm_write' => 'friends',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
			'id' => '6',
            'user_id' => '1',
            'name' => 'publicWriteWhitelist',
            'perm_read' => 'public',
            'perm_write' => 'private',
            'access_token' => '',
        ]);

        DB::table('tags')->insert([
			'id' => '7',
            'user_id' => '1',
            'name' => 'whiteListTag',
            'perm_read' => 'private',
            'perm_write' => 'private',
            'access_token' => '',
        ]);
    }
}
