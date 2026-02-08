import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export const DRIZZLE_DB = Symbol('DRIZZLE_DB')

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE_DB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL')
        if (!connectionString) {
          throw new Error('DATABASE_URL is not set')
        }
        const pool = new Pool({ connectionString })
        return drizzle(pool, { schema })
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DrizzleModule {}
