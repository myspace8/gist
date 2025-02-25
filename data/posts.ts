export type Post = {
  id: string
  user_id: string
  email: string
  created_at: string
  username: string
  content: string
  likes: number
}

export const posts: Post[] = [
  {
    id: "1",
    user_id: "some-unique-user-id",
    email: "deepkyss@example.com",
    username: "Deepkyss",
    content: `Women and confusion\n\nHello, please post for me Keep me anonymous... I've been dating this guy for the past 4 years now and trust me he's a very good person... But there are some stuffs about him I totally don't like...He smokes at least 2-3 times a day, he goes out in the morning with an excuse of going to find money...He comes home late at night with an excuse of going to find money...He comes home with money alright but the thing is I don't know the exact work he's doing...All these stuffs is pushing me away from him\n\nI've met someone else who's also a student just like myself and I'm in love with him too because he's nice and generous...\n\nI'm really confused at this point...I don't know who go in for\n\nI need an advice please.`,
    created_at: "2025-02-22T03:00:00Z",
    likes: 9700,
  },
  {
    id: "2",
    user_id: "user-uuid-002",
    email: "kwamewrites@example.com",
    username: "KwameWrites",
    content: `Ghana's educational system\n\nSometimes I wonder if we are really preparing students for the future or just setting them up for rote memorization and exams. We need more practical applications in our schools. Theory is important, but without practice, how do we expect to innovate?`,
    created_at: "2025-02-21T14:30:00Z",
    likes: 2500,
  },
  {
    id: "3",
    user_id: "user-uuid-003",
    email: "naabakes@example.com",
    username: "NaaBakes",
    content: `Starting a bakery business in Ghana\n\nI'm planning to start a small bakery business in Accra, but I’m struggling with sourcing quality ingredients at affordable prices. Does anyone have recommendations on where to buy bulk baking supplies?`,
    created_at: "2025-02-20T09:15:00Z",
    likes: 1800,
  },
  {
    id: "4",
    user_id: "user-uuid-004",
    email: "techguy@example.com",
    username: "TechGuy",
    content: `The future of AI in Africa\n\nI strongly believe that AI will shape Africa’s future, but we need more people learning how to build AI solutions instead of just consuming them. What are the best resources for beginners who want to get started with AI development?`,
    created_at: "2025-02-19T22:00:00Z",
    likes: 5400,
  },
  {
    id: "5",
    user_id: "user-uuid-005",
    email: "healthtips@example.com",
    username: "HealthTips",
    content: `Drink more water!\n\nMany of us underestimate the power of staying hydrated. If you're feeling sluggish or having headaches often, try increasing your water intake. Your body will thank you!`,
    created_at: "2025-02-18T07:45:00Z",
    likes: 3200,
  },
  {
    id: "6",
    user_id: "user-uuid-006",
    email: "afrobeatlover@example.com",
    username: "AfrobeatLover",
    content: `Who else can't stop listening to the new Burna Boy album? 🎶🔥 The production, the lyrics, everything is just top-notch. What’s your favorite track so far?`,
    created_at: "2025-02-17T19:10:00Z",
    likes: 8700,
  }
];

