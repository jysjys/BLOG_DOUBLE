const cats = [
  {
    id: 1,
    name: 'Black',
    description: 'A sleek and mysterious black cat with piercing yellow eyes. Midnight loves to explore and is known for her graceful movements and independent nature.',
    imageUrl: '/cat_black.jpg',
    traits: ['Independent', 'Curious', 'Playful'],
    age: '2 years old'
  },
  {
    id: 2,
    name: 'Huangmao',
    description: 'A cheerful yellow tabby with a warm personality. Sunny enjoys basking in the sun and is always ready for a cuddle session.',
    imageUrl: '/cat_yellow.jpg',
    traits: ['Friendly', 'Affectionate', 'Laid-back'],
    age: '3 years old'
  },
  {
    id: 3,
    name: 'Erya',
    description: 'A beautiful white cat with a gentle demeanor. Snowball is known for her calm nature and loves to be pampered. she is beautifyful',
    imageUrl: '/cat_white.jpg',
    traits: ['Gentle', 'Elegant', 'Sociable'],
    age: '1.5 years old'
  }
]

export default function Example() {
  return (
    <div className="bg-white py-20 h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Meet Our Cats</h2>
          <p className="mt-2 text-lg/8 text-gray-600">Discover the unique personalities of our feline friends.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {cats.map((cat) => (
            <article key={cat.id} className="flex max-w-xl flex-col items-start justify-between">
              <div className="relative w-full">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm/6 text-gray-600">{cat.description}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">{cat.age}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cat.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
