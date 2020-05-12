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
            'user_id_1' => '4',
            'user_id_2' => '5',
        ]);

        DB::table('friends')->insert([
            'user_id_1' => '5',
            'user_id_2' => '4',
        ]);
    }
}
