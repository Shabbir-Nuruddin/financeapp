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

  { id: 'kid', title: 'New baby 👶', detail: 'A wonderful (and expensive) new chapter begins.', amount: -70000, kind: 'neutral', minAge: 29, maxAge: 41 },
  { id: 'pet', title: 'You adopted a puppy 🐶', detail: 'All the love, plus vet bills and food.', amount: -30000, kind: 'neutral', minAge: 25, maxAge: 50 },
  { id: 'illness', title: 'A serious illness 🤒', detail: 'A tough year health-wise, and a big hospital bill.', amount: -250000, kind: 'bad', minAge: 35, maxAge: 60, insurable: true },
  { id: 'adopt', title: 'You adopted a child 🧒', detail: 'A beautiful decision, with real costs to plan for.', amount: -90000, kind: 'neutral', minAge: 34, maxAge: 48 },
  { id: 'parents', title: 'Parents’ medical care 👵', detail: 'You supported your parents through a health scare.', amount: -150000, kind: 'bad', minAge: 38, maxAge: 58, insurable: true },
  { id: 'freelance', title: 'Side hustle paid off 💻', detail: 'A freelance project brought in extra cash.', amount: 120000, kind: 'good', minAge: 25, maxAge: 50 },
  { id: 'festival', title: 'Festival bonus 🪔', detail: 'Diwali bonus landed in your account.', amount: 40000, kind: 'good', minAge: 23, maxAge: 58 },
  { id: 'car-repair', title: 'Car broke down 🔧', detail: 'A surprise repair bill you didn’t budget for.', amount: -55000, kind: 'bad', minAge: 30, maxAge: 58 },
  { id: 'home-repair', title: 'Home repairs 🏚️', detail: 'Something broke and had to be fixed now.', amount: -80000, kind: 'bad', minAge: 33, maxAge: 60 },
  { id: 'scam', title: 'Fell for a phishing scam 🎣', detail: 'A fake “bank” call cost you before you caught it.', amount: -60000, kind: 'bad', minAge: 24, maxAge: 55 },
  { id: 'vacation', title: 'Dream vacation ✈️', detail: 'You treated yourself to a well-earned trip.', amount: -90000, kind: 'neutral', minAge: 27, maxAge: 55 },
  { id: 'friend-wedding', title: 'Best friend’s wedding 🎊', detail: 'Travel, gifts and outfits added up.', amount: -45000, kind: 'neutral', minAge: 25, maxAge: 40 },
]
