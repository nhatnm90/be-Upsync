import { pgTable, serial, timestamp, boolean, integer, index, uniqueIndex, decimal } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './user'
import { match } from './match'
import { betSideEnum } from './const'
import { groupLeague } from './groupLeague'

export const userMatchBet = pgTable(
  'user_match_bet',
  {
    // --- PHẦN 1: ĐỊNH NGHĨA CỘT ---
    id: serial('id').primaryKey(),

    // Foreign Keys (Khóa ngoại)
    // .notNull() là rất quan trọng để đảm bảo tính toàn vẹn dữ liệu
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    matchId: integer('match_id')
      .notNull()
      .references(() => match.id),
    groupLeagueId: integer('group_league_id')
      .notNull()
      .references(() => groupLeague.id),
    // Thông tin đặt cược
    selectedSide: betSideEnum('selected_side').notNull(), // Chọn Home hoặc Away
    // Lưu tỉ lệ chấp tại thời điểm đặt (Snapshot). Dùng decimal để chính xác số thực.
    // precision: 4, scale: 2 nghĩa là lưu được số kiểu 10.50
    handicapValue: decimal('handicap_value', { precision: 4, scale: 2 }).notNull(),
    // Trạng thái thanh toán & timestamps
    isPaid: boolean('is_paid').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (table) => [
    // A. Single Index (Index đơn)
    // Tăng tốc query khi tìm lịch sử cược của 1 user: WHERE user_id = ...
    index('idx_umb_user_id').on(table.userId),
    // Tăng tốc query khi tính toán kết quả cho 1 trận đấu: WHERE match_id = ...
    index('idx_umb_match_id').on(table.matchId),
    // B. Composite Index (Index phức hợp - Performance)
    // Tăng tốc query khi muốn xem "Tất cả lệnh cược của User X trong Giải Y"
    // Query: WHERE user_id = ... AND group_league_id = ...
    index('idx_umb_user_group').on(table.userId, table.groupLeagueId),
    // C. Composite Unique Index (Quan trọng nhất cho Logic Business)
    // Ràng buộc: Một User chỉ được đặt 1 lần cho 1 Match trong 1 Group.
    // Nếu cố tình insert dòng thứ 2 trùng cả 3 field này -> DB sẽ báo lỗi ngay lập tức.
    uniqueIndex('uq_umb_user_match_group').on(table.userId, table.matchId, table.groupLeagueId)
  ]
)

const userMatchBetSchema = createInsertSchema(userMatchBet)
export type UserMatchBetSchema = z.infer<typeof userMatchBetSchema>
