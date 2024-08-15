import { http, HttpResponse, rest } from 'msw';

// Define mock API response data
const data = [
    {q_id: -1, qns: "Do you have any dietary restrictions?", options: [{opt: "None", points: 0}, {opt: "Vegetarian", points: 0}, {opt: "Halal", points: 0}, {opt: "Halal, Vegetarian", points: 0}] },
    {q_id: -2, qns: "What is your preferred price range?", options: [{opt: "$", points: 0}, {opt: "$$", points: 0}, {opt: "$$$", points: 0}, {opt: "$$$$", points: 0}] }, 
    { q_id: 1, qns: "What colour describes your mood?", options: [{ opt: "Blue", points: 1 }, { opt: "Green", points: 2 }, { opt: "Pink", points: 3 }] },
    { q_id: 2, qns: "What animal would you keep as a pet?", options: [{ opt: "Giraffe", points: 4 }, { opt: "Deer", points: 5 }, { opt: "Kangaroo", points: 6 }] },
    { q_id: 3, qns: "What is your favourite time of the day?", options: [{ opt: "Morning", points: 7 }, { opt: "Afternoon", points: 8 }, { opt: "Evening", points: 9 }] }
];

const folder = {folder_id: 2, folder_name: 'All'};

// Define mock functions
const checkEmail = vi.fn((userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
});

export const handlers = [
    http.get("https://restaurant-roulette-backend.vercel.app/homepage", () => {
        return HttpResponse.json({
            user_name: 'Test1',
        })
    }),
    http.get("https://restaurant-roulette-backend.vercel.app/api/quiz", () => {
        return HttpResponse.json({
            data
        });
    }),
    http.post("https://restaurant-roulette-backend.vercel.app/auth/register", async ({ request }) => {
        const newUser = await request.json();
        const { name, email, password } = newUser;
        const token = newUser;
        return HttpResponse.json({token});
    }),
    http.get("https://restaurant-roulette-backend.vercel.app/api/favourites/2", () => {
        return HttpResponse.json({
            data: {
                folder: folder
            }
        });
    })
]