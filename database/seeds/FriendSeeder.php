<?php

use Illuminate\Database\Seeder;

class FriendSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('friends')->insert([
            'user_id_1' => '1',
			'user_id_2' => '2',
			'pending' => false,
        ]);

        DB::table('friends')->insert([
            'user_id_1' => '2',
			'user_id_2' => '1',
			'pending' => false,
		]);
		
		DB::table('friends')->insert([
            'user_id_1' => '3',
			'user_id_2' => '1',
			'pending' => true,
        ]);
    }
}
