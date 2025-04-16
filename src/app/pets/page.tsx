'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Pet {
  id: number
  name: string
  age: number
  color: string
  breed: string
  description: string
  imageUrl?: string
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPet, setCurrentPet] = useState<Pet | null>(null)
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    age: 0,
    color: '',
    breed: '',
    description: '',
    imageUrl: ''
  })

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    const response = await fetch('/api/pets')
    const data = await response.json()
    setPets(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = currentPet ? 'PUT' : 'POST'
    const url = '/api/pets'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentPet ? { ...currentPet, ...formData } : formData),
    })

    if (response.ok) {
      setIsModalOpen(false)
      setCurrentPet(null)
      setFormData({
        name: '',
        age: 0,
        color: '',
        breed: '',
        description: '',
        imageUrl: ''
      })
      fetchPets()
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      await fetch('/api/pets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      fetchPets()
    }
  }

  const handleEdit = (pet: Pet) => {
    setCurrentPet(pet)
    setFormData(pet)
    setIsModalOpen(true)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full">
        <div className="mx-auto max-w-2xl text-center pt-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Pet Management</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Manage your pets with our easy-to-use interface
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              setCurrentPet(null)
              setFormData({
                name: '',
                age: 0,
                color: '',
                breed: '',
                description: '',
                imageUrl: ''
              })
              setIsModalOpen(true)
            }}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add New Pet
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
          {pets.map((pet) => (
            <div key={pet.id} className="rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-200">
              {pet.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">{pet.name}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm leading-6 text-gray-600">Age: {pet.age} years</p>
                <p className="text-sm leading-6 text-gray-600">Color: {pet.color}</p>
                <p className="text-sm leading-6 text-gray-600">Breed: {pet.breed}</p>
                <p className="text-sm leading-6 text-gray-600">{pet.description}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleEdit(pet)}
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="text-sm font-semibold leading-6 text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                  {currentPet ? '编辑宠物信息' : '添加新宠物'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      名字
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入宠物名字"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      年龄
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) })}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入宠物年龄"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      毛色
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入宠物毛色"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                      品种
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="breed"
                        value={formData.breed}
                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入宠物品种"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      简介
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入宠物简介"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      图片URL（可选）
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="请输入图片URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {currentPet ? '更新' : '添加'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 