<?php

use Illuminate\Database\Seeder;

class LinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('links')->insert([
			'id' => '1',
            'user_id' => '1',
            'link' => 'https://www.youtube.com/watch?v=UnqLHiyJy-I',
            'name' => 'funny yt vid',
        ]);

        DB::table('links')->insert([
			'id' => '2',
            'user_id' => '1',
            'link' => 'https://www.youtube.com/watch?v=pKFQGXu1zfo',
            'name' => 'funny yt video 2',
        ]);

        DB::table('links')->insert([
			'id' => '3',
            'user_id' => '1',
            'link' => 'https://www.youtube.com/watch?v=M8NFhjj0bUk',
            'name' => 'boring yt vid',
        ]);

        DB::table('links')->insert([
			'id' => '4',
            'user_id' => '1',
            'link' => 'https://www.dailymotion.com/video/x37fpxm',
            'name' => 'funny dailymotion vid',
        ]);

        DB::table('links')->insert([
			'id' => '5',
            'user_id' => '1',
            'link' => 'https://cheezburger.com/4035845/50-hilarious-memes-thatll-make-you-lose-it',
            'name' => 'funny meme',
        ]);

        DB::table('links')->insert([
			'id' => '6',
            'user_id' => '1',
            'link' => 'http://localhost:8080/me/tags/',
            'name' => 'Link of Every Tag',
        ]);
    }
}
