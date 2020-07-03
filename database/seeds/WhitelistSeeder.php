<?php

use Illuminate\Database\Seeder;

class WhitelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('whitelist')->insert([
            'tag_id' => '6',
            'user_id' => '2',
            'perm_read' => '0',
            'perm_write' => '1',
        ]);

        DB::table('whitelist')->insert([
            'tag_id' => '7',
            'user_id' => '2',
            'perm_read' => '1',
            'perm_write' => '0',
        ]);
    }
}
