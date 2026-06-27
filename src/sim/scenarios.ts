// Random life events the simulator can throw at the player.
export interface LifeEventDef {
  id: string
  title: string
  detail: string
  amount: number // signed cash impact
  kind: 'good' | 'bad' | 'neutral'
  minAge: number
  maxAge: number
  insurable?: boolean // softened if user has insurance
}

export const LIFE_EVENTS: LifeEventDef[] = [
  { id: 'bonus', title: 'Performance bonus! 🎉', detail: 'Your hard work paid off with a fat bonus.', amount: 80000, kind: 'good', minAge: 24, maxAge: 55 },
  { id: 'promotion', title: 'Promotion 🚀', detail: 'A big role bump, and a windfall arrear.', amount: 150000, kind: 'good', minAge: 27, maxAge: 50 },
  { id: 'market-rally', title: 'Bull run 🐂', detail: 'Markets surged this year and your equity loved it.', amount: 0, kind: 'good', minAge: 24, maxAge: 60 },
  { id: 'gift', title: 'Family gift', detail: 'A generous gift from family during a festival.', amount: 50000, kind: 'good', minAge: 23, maxAge: 40 },

  { id: 'medical', title: 'Medical emergency 🏥', detail: 'An unexpected hospital bill landed.', amount: -120000, kind: 'bad', minAge: 24, maxAge: 60, insurable: true },
  { id: 'phone', title: 'Phone died 📱', detail: 'Had to replace your phone unexpectedly.', amount: -45000, kind: 'bad', minAge: 23, maxAge: 45 },
  { id: 'job-gap', title: 'Layoff 😬', detail: 'A few months between jobs drained your savings.', amount: -90000, kind: 'bad', minAge: 26, maxAge: 50 },
  { id: 'family-help', title: 'Family needed help', detail: 'You stepped up for a family expense.', amount: -60000, kind: 'bad', minAge: 25, maxAge: 55 },
  { id: 'wedding', title: 'Wedding in the family 💍', detail: 'Celebrations are joyful but not cheap.', amount: -100000, kind: 'bad', minAge: 26, maxAge: 38 },

  { id: 'kid', title: 'New baby 👶', detail: 'A wonderful (and expensive) new chapter begins.', amount: -70000, kind: 'neutral', minAge: 28, maxAge: 40 },
]
