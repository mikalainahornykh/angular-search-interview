const FIRST_NAMES = [
  'Anna', 'Boris', 'Daria', 'Egor', 'Irina', 'Kirill', 'Maria', 'Nikita',
  'Olga', 'Pavel', 'Sofia', 'Timur', 'Vera', 'Artem', 'Elena', 'Maxim',
];
const FEMALE = new Set(['Anna', 'Daria', 'Irina', 'Maria', 'Olga', 'Sofia', 'Vera', 'Elena']);
const LAST_NAMES = [
  'Ivanov', 'Petrov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov',
  'Lebedev', 'Kozlov', 'Novikov', 'Morozov',
];
const CITIES = ['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk', 'Yekaterinburg', 'Minsk', 'Almaty', 'Tbilisi'];
const ROLES = ['Developer', 'Designer', 'Manager', 'QA', 'Analyst'];

/** Deterministic set of 80 users, identical on every run. */
export const USERS = Array.from({ length: 80 }, (_, i) => {
  const first = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3) % LAST_NAMES.length] + (FEMALE.has(first) ? 'a' : '');
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first}.${last}${i + 1}@example.com`.toLowerCase(),
    city: CITIES[(i * 5) % CITIES.length],
    role: ROLES[i % ROLES.length],
  };
});
