<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);

        $this->call(TagSeeder::class);

        $this->call(LinkSeeder::class);

        $this->call(TagLinkSeeder::class);

        $this->call(FriendSeeder::class);

        $this->call(WhitelistSeeder::class);
    }
}
