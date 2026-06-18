import { Module } from "@nestjs/common";
import UserSeeder from "./user.seeder";

@Module({
  providers:[UserSeeder],
  exports:[UserSeeder]
})
export class SeederModule{}