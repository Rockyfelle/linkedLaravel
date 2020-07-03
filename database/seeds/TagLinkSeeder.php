<?php

use Illuminate\Database\Seeder;

class TagLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '1',
            'link_id' => '1',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '2',
            'link_id' => '1',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '3',
            'link_id' => '1',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '1',
            'link_id' => '2',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '2',
            'link_id' => '2',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '3',
            'link_id' => '2',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '1',
            'link_id' => '3',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '2',
            'link_id' => '3',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '2',
            'link_id' => '4',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '3',
            'link_id' => '4',
        ]);

        DB::table('taglinks')->insert([
            'user_id' => '1',
            'tag_id' => '3',
            'link_id' => '5',
        ]);

        //Add the "link of every tag" link to every tag
        for ($i = 1; $i < 8; $i++) {
            DB::table('taglinks')->insert([
                'user_id' => '1',
                'tag_id' => $i,
                'link_id' => '6',
            ]);
		}
		
		DB::table('taglinks')->insert([
            'user_id' => '2',
            'tag_id' => '8',
            'link_id' => '7',
        ]);
    }
}
