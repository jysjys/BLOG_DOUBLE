'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

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
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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
    <div className="bg-white min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">宠物管理</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            轻松管理您的宠物信息
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
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
          >
            添加新宠物
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-8">
          {pets.map((pet) => (
            <div key={pet.id} className="relative group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1">
              {pet.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg mb-6">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold leading-8 text-gray-900">{pet.name}</h3>
              <div className="mt-4 space-y-2 text-base">
                <p className="leading-6 text-gray-600">年龄: {pet.age} 岁</p>
                <p className="leading-6 text-gray-600">毛色: {pet.color}</p>
                <p className="leading-6 text-gray-600">品种: {pet.breed}</p>
                <p className="leading-6 text-gray-600">{pet.description}</p>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleEdit(pet)}
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="text-sm font-semibold leading-6 text-red-600 hover:text-red-500 transition-colors duration-200"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-xl bg-white px-6 pb-6 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                        className="block w-full rounded-md border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200"
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
                        className="block w-full rounded-md border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200"
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
                        className="block w-full rounded-md border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200"
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
                        className="block w-full rounded-md border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200"
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
                        className="block w-full rounded-md border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition-all duration-200"
                        placeholder="请输入宠物简介"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">宠物头像</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center w-full">
                        <label 
                          htmlFor="image" 
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 transition-colors duration-200"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">点击上传</span> 或拖拽图片到此处
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF (最大 2MB)</p>
                          </div>
                          <input 
                            id="image" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              
                              setUploading(true)
                              setUploadProgress(0)
                              
                              const fileExt = file.name.split('.').pop()
                              const fileName = `${Math.random()}.${fileExt}`
                              const filePath = `${fileName}`
                              
                              const { data, error } = await supabase.storage
                                .from('uploads')
                                .upload(filePath, file, {
                                  cacheControl: '3600',
                                  upsert: false,
                                  contentType: file.type
                                })
                              
                              if (error) {
                                alert('上传失败: ' + error.message)
                              } else {
                                const { data: { publicUrl } } = await supabase.storage
                                  .from('uploads')
                                  .getPublicUrl(filePath)
                                setFormData({ ...formData, imageUrl: publicUrl })
                              }
                              
                              setUploading(false)
                            }}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      
                      {uploading && (
                        <div className="w-full">
                          <div className="text-sm mb-1 text-center">上传中...</div>
                          <progress 
                            className="progress progress-primary w-full" 
                            value={uploadProgress} 
                            max="100"
                          ></progress>
                        </div>
                      )}
                      
                      {formData.imageUrl && !uploading && (
                        <div className="alert alert-success shadow-lg mt-2">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>已上传: {formData.imageUrl}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:ring-gray-400 transition-all duration-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
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